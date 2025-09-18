
import express from 'express';
import { fileURLToPath } from 'url';
import path,{dirname} from 'path';
import {Server} from 'socket.io';
import { createServer} from 'http'

const __filename=fileURLToPath(import.meta.url);
const __dirname= dirname(__filename);

const app=express();
const httpServer=createServer(app);

const io= new Server(httpServer);

httpServer.listen(3000,()=>{
     console.log(`server runing on http://localhost:3000`);
});

app.use(express.static("public"));

io.on("connection",(socket)=>{
     console.log("client connected",socket.id);
     socket.on("details",(arg)=>{
          console.log(arg);   
          io.emit("details",arg);
     });
});







