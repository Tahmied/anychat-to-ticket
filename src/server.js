import dotenv from 'dotenv';
import { app } from './app.js';
import { connectDb } from './utils/ConnectDb.js';

dotenv.config({
    path: './.env'
})

connectDb()
    .then(() => {
        app.listen(process.env.PORT || 2000, () => {
            console.log(`server is running on http://localhost:${process.env.PORT}`);
        })
    })
    .catch(()=>{
        console.log('db fucked up')
    })