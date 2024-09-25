import { DataTypes,Model,Optional } from "sequelize";
import sequelize from "../config/database";

interface addressAttributes{
    id:number;
    country:string;
    state:string;
    city:string;
    addresses:string;
    zipcode:number;
    type:string;
}

interface omitid extends Omit<addressAttributes,'id'>{}
class Address extends Model<addressAttributes,omitid>
implements addressAttributes{
    public id!: number;
    public country!: string;
    public state!: string;
    public city!: string;
    public addresses!: string;
    public zipcode!: number;
    public type!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Address.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    country:{
        type:DataTypes.STRING,
        allowNull:false
    },
    state:{
        type:DataTypes.STRING,
        allowNull:false
    },
    city:{
        type:DataTypes.STRING,
        allowNull:false
    },
    addresses:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    zipcode:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    type:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    tableName:"address",
    sequelize
})

export default Address