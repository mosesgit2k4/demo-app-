import { Response,Request } from 'express';
import { UserServices } from '../../service/service';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken'
import dotenv, { secret_token } from '../../config/dotenv';
import nodemailer from 'nodemailer'
import { htmlcontent } from '../../config/html';
import { userexist, emailexist, phoneexist } from '../../responsemessage';
import Joi, { string } from 'joi';
import usersSessionHandler from '../../authHandler/middlewareauthHandler';
import { AuthenticatedRequest } from '../../authHandler/profilehandler';


const PostBody = Joi.object({
    firstName: Joi.string().required().min(3).max(10).messages({
        'string.base': "FirstName must be string",
        'string.empty': "FirstName must not be empty",
        'string.min': 'There must be atleast 3 character',
        'any.required': "FirstName is required"

    }),
    lastName: Joi.string().min(3).max(10).required().messages({
        'string.base': "LastName must be string",
        'string.empty': "LastName must not be empty",
        'string.min': 'There must be atleast 3 character',
        'any.required': "LastName is required"

    }),
    email: Joi.string().email().required().lowercase().messages({
        'string.base': "Email must be string",
        'string.empty': "Email must not be empty",
        'string.email': "Email must be like a email Id example:helloworld@gmail.com",
        'any.required': "Email is required"

    }),
    username: Joi.string().required().messages({
        'string.base': "Username must be string",
        'string.empty': "Username must not be empty",
        'any.required': "Username is required"
    }),
    password: Joi.string().required().regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/).min(8).messages({
        'string.base': "Password must be string",
        'string.empty': "Password must not be empty",
        'any.required': "Password is required",
        'string.pattern.base': 'Minimum 8 character is needed and atleast 1 uppercase , 1 lowercase and 1 digit is required'

    }),
    mobilephone: Joi.number().required().max(10 ** 10 - 1).min(10 ** 9).required().messages({
        'number.base': "Mobile Number must be number",
        'number.min': "Number must be 10 digit",
        'number.max': "Number must be 10 digit",
        'any.required': "Mobile Number is required"

    }),
    image: Joi.string().required().messages({
        'any.required': "Give a proper image"
    }),
    isadmin: Joi.string().required().messages({
        'any.required': "Select an option"
    }),
    country:Joi.string().required(),
    state:Joi.string().required(),
    city:Joi.string().required(),
    addresses:Joi.string().required(),
    zipcode:Joi.number().required(),
    type:Joi.string().required()
})
interface login {
    username: string;
    password: string;
}
let otp_store: string[] = []
let emailstore: string[] = []
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: dotenv.gmail,
        pass: dotenv.password
    }
})

export class UserController {
    //Register User
    createUser = async (req: Request, res: Response) => {
        try {
            const { value, error } = PostBody.validate(req.body, { abortEarly: false })
            const { firstName, image, isadmin, lastName, email, username, password, mobilephone, country, state, addresses, city, zipcode, type } = value
            const message = {
                from: dotenv.gmail,
                to: `${email}`,
                subject: "Congrats on Registering",
                html: htmlcontent
            }
            const emailval = await UserServices.getusersByemail(email)
            const usernameval = await UserServices.getUserByUsername(username)
            if (error) {
                res.status(401).json({ message: error.details[0].message })
                return

            }
            if (usernameval) {
                res.status(401).json({ message: userexist })
                return
            }
            if (emailval) {
                res.status(401).json({ message: emailexist })
                return
            }
            const phnnumber = await UserServices.getUsersByphone(mobilephone)
            if (phnnumber) {
                res.status(401).json({ message: phoneexist })
                return
            }

            const user = await UserServices.createUser({ firstName, lastName, email, username, password, mobilephone, image, isadmin }, { country, state, addresses, city, zipcode, type })
            transporter.sendMail(message, function (err, info) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(info.response)
                }
            })
            res.status(200).send(user)
        }
        catch (error) {
            const errorMessage: string = (error as Error).message;
            res.send(errorMessage)
        }
    }
    //login User
    loginUser = async (req: Request, res: Response) => {
        const { username, password }: login = req.body
        try {
            const user = await UserServices.getUserByUsername(username);
            if (!user) {
                return res.status(400).json({ message: "Invalid Username" });
            }
            const passwordMatch = await compare(password, user.password as string);
            if (passwordMatch) {
                const payload = { username: username, userid: user.id };
                const jwtToken = sign(payload, secret_token);
                return res.status(200).json({jwtToken, admin: user.isadmin});
            } else {
                return res.status(400).json({ message: "Invalid  Password" });
            }
        } catch (error) {
            console.log(error);
        }
    }
    //forget password
    forgetUser = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const emailverify = await UserServices.getusersByemail(email)
            let otp = Math.floor(1000 + Math.random() * 9000);
            if (emailverify) {
                const mailOptions = {
                    from: "mosesstibu@gmail.com",
                    to: `${email}`,
                    subject: "Password reset OTP",
                    text: `Your OTP IS: ${otp}`,
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        emailstore.unshift(email)
                        otp_store.unshift(otp.toString());
                        console.log(info.response)
                        res.json({ data: `OTP has been sent to the email ${email}` })
                    }
                })
            }
            else {
                res.status(401).json({ data: "Give a correct Email" })
            }
        } catch (error) {
            console.log(error)
        }
    }
    //reset password
    resetpassword = async (req: Request, res: Response) => {
        try {
            const otp = req.body;
            if (otp.otp === otp_store[0]) {
                res.status(200).json({ message: "Thank you for the OTP" })
            }
            else {
                res.status(401).json({ message: "Give a correct OTP" })
            }
        } catch (error) {
            console.log(error)
        }
    }

    //confirm password
    confirmpassword = async (req: Request, res: Response) => {
        const { newpassword, confirmpassword } = req.body
        try {
            let email1 = emailstore[0]
            if (newpassword.length < 8) {
                res.status(401).json({ message: "Minimum 8 character is needed" })
                return
            }
            let count = 0;
            let i;
            for (i = 0; i < newpassword.length; i++) {
                if (/[A-Z]/.test(newpassword[i])) { count++ }
                if (/[0-9]/.test(newpassword[i])) { count++ }
            }
            if (count < 4) {
                res.status(401).json({ message: "Give a strong Password" })
                return
            }
            const emailverify = await UserServices.getusersByemail(email1)
            if (emailverify) {
                const passwordma = await compare(newpassword, emailverify.password);
                if (passwordma) {
                    res.status(401).json({ message: "U have entered the your old password" })
                    return
                }
            }
            const updatedResult = await UserServices.updatepassword(email1, newpassword, confirmpassword)
            if (updatedResult === "Password does not match") {
                res.status(401).json({ message: "Password does not match" })
            }
            else if (updatedResult) {
                res.status(200).json({ message: "Password updated successfully" })
                otp_store = []
            }
            else {
                res.status(401).json({ message: "Email not found" })
            }
        } catch (error) {
            console.log(error)
        }

    }


    //getimage
    getuserprofile = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if(req.profileid !== undefined){
                const id = req.profileid
                const user = await UserServices.getusersByid(id)
                if (user) {
                    res.send(user).status(200)
                }
                else {
                    res.status(401).json({ message: "User not Found" })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    //update user
    updateuser = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if(req.profileid !== undefined){
                const id = req.profileid;
            const { newfirstName, newlastName, newemail, newusername, newmobilephone, newimage } = req.body
            const updateduser = await UserServices.updateuser(id, newfirstName, newlastName, newemail, newusername, newmobilephone, newimage)
            if (updateduser) {
                res.status(200).json({ message: "User updated successfully" })
            }
            }
        } catch (error) {
            console.log(error)
        }
    }

    //create plan
    createplan = async(req:Request,res:Response)=>{
        try {
            const {name,description,image,start,end} = req.body
            if(image === ""){
                res.status(401).json({message:"Give a image"})
                return
            }
            const plan = await UserServices.createplans({name,description,image,start,end})
            res.status(200).send(plan)
        } catch (error) {
            console.log(error)
        }
    }
    //get plan
    getplan = async(req:Request,res:Response)=>{
        try {
            const plans = await UserServices.getplans();
            res.send(plans)
        } catch (error) {
            console.log(error)
        }
    }


    //get plan by id
    getplanid = async(req:Request,res:Response)=>{
        try {
            const planid = parseInt(req.params.planId,10)
            const plan = await UserServices.getplanbyid(planid)
            if(plan){
                res.json(plan)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const UserControllers = new UserController()