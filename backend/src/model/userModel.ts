import {DataTypes,Model,Optional } from "sequelize";
import sequelize from "../config/database";
import bcrypt from 'bcrypt'
import Joi from 'joi'
import Address from "./addressModel";


interface UserAttributes{
    id:number;
    firstName:string;
    lastName:string;
    username:string;
    email:string;
    mobilephone:number;
    password:string;
    image:string;
    isadmin:string;
    addressid:number
}

interface UserCreationAttributes extends Optional<UserAttributes,'id'>{}


class User extends Model<UserAttributes,UserCreationAttributes>
implements UserAttributes{
    public mobilephone!: number;
    public id!:number;
    public firstName!: string;
    public lastName!: string;
    public password!: string;
    public username!: string;
    public email!: string;
    public image!:string;
    public isadmin!: string;
    public addressid!: number;
    public readonly createAt!:Date;
    public readonly updateAt!:Date;
    public static hashPassword(password:string):Promise<string>{
        return bcrypt.hash(password,10)
    }

}

User.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false,
        },
        firstName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        lastName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        username:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        mobilephone:{
            type:DataTypes.BIGINT,
            allowNull:false,           
        },
        addressid:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:Address,
                key:"id"
            }
        },
        image:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        isadmin:{
            type:DataTypes.STRING,
            defaultValue:false
        }
    },{
        tableName:"login",
        sequelize,
        hooks : {
            beforeCreate: async (user:User)=>{
                user.password = await User.hashPassword(user.password);
            },
            beforeUpdate: async (user:User)=>{
                if(user.changed('password')){
                    user.password = await User.hashPassword(user.password);
                }
            },
        },
    }
);

export default User;