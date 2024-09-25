import dotenv from "./dotenv";
import {Sequelize} from 'sequelize'

const sequelize = new Sequelize(dotenv.DB_NAME,dotenv.DB_USER,dotenv.DB_PASSWORD,{
    host:dotenv.DB_HOST,
    dialect:'mysql',
    username:'root',
    logging:false
});

export default sequelize