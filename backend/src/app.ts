import express from 'express'
import sequelize from './config/database'
import bodyParser from 'body-parser'
import {router} from './router'
const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use('/api',router)
app.use('/public/images',express.static('./public/images'))

sequelize.authenticate().then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log('Error at db connect ...',err);
})

sequelize.sync({alter:true}).then(()=>{
    console.log("Table created")
}).catch((err)=>{
    console.log("Error at creating Table")
})

export default app;
