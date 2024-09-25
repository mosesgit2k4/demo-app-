import dotenv from 'dotenv'
dotenv.config()

export default {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || "Mo$27012004",
    DB_NAME: process.env.DB_NAME || "login",
    PORT: process.env.DB_PORT || 5000,
    gmail: process.env.GMAIL,
    password:process.env.PASSWORD
}
export const secret_token = "goodie";