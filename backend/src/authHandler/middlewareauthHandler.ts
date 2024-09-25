import {Request,Response,NextFunction} from "express"
import {JwtPayload, verify} from "jsonwebtoken"
import { secret_token } from "../config/dotenv";
import User from "../model/userModel";

async function usersSessionHandler(req:Request| any ,res:Response, next:NextFunction){
    const authHeader = req.headers["authorization"]
            let jwtToken
            if(authHeader!=undefined){
                jwtToken = authHeader.split(" ")[1]
            }
            if(jwtToken===undefined){
                res.status(401).json({message:"No JWT Token "})
                return
            }
            else{
                verify(jwtToken, secret_token, async (error: any, payload: any) => {
                    if (error) {
                        res.status(401).json({ message: "Invalid JWT Token" });
                        return 
                    }
                    else {
                        const userdta :any= await User.findOne({where:{id:payload.userid}})
                        req.profileid = userdta.id as number
                        next();
                        
                    }
                })
            }
}



export default usersSessionHandler