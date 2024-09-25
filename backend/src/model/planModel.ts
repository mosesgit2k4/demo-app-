import { DataTypes,Model } from "sequelize";
import sequelize from "../config/database";

interface planAttributes{
    id:number;
    name:string;
    start:Date;
    end:Date;
    image:string;
    description:string;
}

interface omitid extends Omit<planAttributes,'id'>{}
class Plan extends Model<planAttributes,omitid>
implements planAttributes{
    public id!: number;
    public name!: string;
    public start!: Date;
    public end!: Date;
    public image!: string;
    public description!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Plan.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    start:{
        type:DataTypes.DATE,
        allowNull:false
    },
    end:{
        type:DataTypes.DATE,
        allowNull:false
    },
    image:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    tableName:"plans",
    sequelize
})

export default Plan