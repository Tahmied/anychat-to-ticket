import dotenv from 'dotenv';
import { app } from './app.js';

dotenv.config({
    path: './.env'
})

app.listen(process.env.PORT || 2000, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`);
})
