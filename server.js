
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



class Client{
     constructor(playerId){
          this.clientInfo={
               id:playerId,
               msg:"input",
          };
          this.gameState={
               x:0,
               y:0,
               rotation:0,
               speed:0,  
          };
             
     }

     gameInfo(){
          if(this.clientInfo.msg==="moved ahead"){
               this.gameState.x++;
               this.gameState.y++;
          }
          else if(this.clientInfo.msg==="turned right"|| this.clientInfo.msg=== "turned left"){
               this.gameState.rotation++;
          }
          else if (this.clientInfo.msg==="accelerated"){
               this.gameState.speed++;
          };
          
     };
}

let playerCounter=0;
let players={};
let clients={};
let gameWorld={};

io.on("connection",(socket)=>{
    
     playerCounter++;
     players[socket.id]=`player${playerCounter}`;
     //console.log(`${players[socket.id]} connected`);
      
     clients[socket.id]=new Client(players[socket.id]);
     gameWorld[players[socket.id]]=clients[socket.id].gameState;
     

     socket.on("details",(clientInput)=>{
          clients[socket.id].clientInfo.msg= clientInput.action;
          clients[socket.id].gameInfo();
          console.log(gameWorld);
          io.emit("gameUpdate",gameWorld);
          });

          

     socket.on("disconnect",()=>{
               delete clients[socket.id];
               delete gameWorld[players[socket.id]];
               io.emit("gameUpdate",gameWorld);
               //console.log(gameWorld);
          })
     
     
              
     });

     


     
     
         
    







