import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from 'cors';
import { dirname } from "path";
import multer from "multer";
import { mkdir } from "fs/promises";
import connection from "./Database/db.js";
import runTest from "./Test_Script/script.js";

const app = express();
const port = 3000;
connection();
app.use(cors({
    origin:['https://algotest1.netlify.app','http://localhost:5173','https://algotest2.netlify.app'],
    methods:['GET','POST'],
    credentials:true
}))
app.use(express.json())

const storage = multer.diskStorage({
    destination:async(req,file,cb)=>{
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const uploadDir = path.join(__dirname,'upload');
        try{ 
            await mkdir(uploadDir, {recursive:true});
            cb(null,uploadDir);
        }
        catch(err){
            console.log("Destination folder error");
        }
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
})

const upload = multer({storage});

app.get('/',(req,res)=>{
    res.send("Jai Balaji");
})

app.post('/v1/test',upload.single('file'),runTest)



app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
})
