import User from "../model/userModel";
import bcrypt from 'bcrypt'
import Address from "../model/addressModel";
import Plan from "../model/planModel";
interface Createusers {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    mobilephone: number;
    image: string;
    isadmin:string;
}
interface CreatePlan{
    name:string;
    start:Date;
    end:Date;
    image:string;
    description:string;

}
interface CreateAddress{
    country: string;
    state: string;
    city: string;
    addresses: string;
    zipcode: number;
    type: string;
}

class UserService {
    async createUser(userData: Createusers,addressData:CreateAddress) {
        try {
            const address = await Address.create(addressData)
            const user = await User.create({...userData , addressid:address.id})
            return user
        }
        catch (err) {
            console.log(err)
            return { message: "There is an error" }
        }
    }
    async getusersByid(id: number) {
        try {
            const user = await User.findOne({ where: { id }})
            if(user === null){
                return 'User not Found'
            }
            const {password,...userwithoutpassword} = user.toJSON()
            return userwithoutpassword  
        }
        catch (error) {
            console.log(error);
            return 'Error occurred';
        }
    }
    async getusersByemail(email: string) {
        try {
            return User.findOne({ where: { email } })
        }
        catch (error) {
            console.log(error)
        }
    }
    async getUserByUsername(username: string) {
        try {
            return User.findOne({ where: { username } });
        } catch (error) {
            console.log(error)
        }
    }
    async getUsersByphone(mobilephone: number) {
        try {
            return User.findOne({ where: { mobilephone } });
        }
        catch (error) {
            console.log(error)
        }

    }
    async updatepassword(email: string, newpassword: string, confirmpassword: string) {
        if (newpassword !== confirmpassword) {
            return "Password does not match"
        }
        try {
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            const [update] = await User.update({ password: hashedPassword }, {
                where: { email },
                returning: true
            });
            if (update === 0) {
                return null
            }
            return true
        } catch (error) {
            console.log(error)
        }
    }
    async updateuser(id:number,newfirstName:string,newlastName:string,newemail:string,newusername:string,newmobilephone:number,newimage:string){
        try{
            const [update] = await User.update({firstName:newfirstName,username:newusername,lastName:newlastName,email:newemail,mobilephone:newmobilephone,image:newimage},{
                where:{id},
                returning: true
            })
            if(update === 0){
                return null
            }
            return true
        }
        catch(error){
            console.log(error)
        }
    }
    async createplans(plansData:CreatePlan){
        try {
            const plans = await Plan.create(plansData)
            return plans
        } catch (error) {
            console.log(error)
            return {message:"There is an error"}
        }
    }
    async getplans(){
        try {
            const plan = await Plan.findAll()
            if(plan === null){
                return 'Plan not found'
            }
            return plan
        } catch (error) {
            console.log("Error:",error)   
        }
    }
    async getplanbyid(id:number){
        try {
            const plan = Plan.findByPk(id)
            if(!plan){
                return
            }
            return plan
        } catch (error) {
            
        }
    }
}

export const UserServices = new UserService()