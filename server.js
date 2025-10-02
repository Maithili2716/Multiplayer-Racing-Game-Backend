
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


 

let gameOver=false;
let gameLoop=null;


class Client{
     constructor(playerId){
          this.clientInfo={
               id:playerId,
               msg:"input",
          };
          this.gameState={
               x:0,
               y:0,
               r:0, 
               msg:"",
          };
             
     }

     gameInfo(){
               let rotation= this.gameState.r*(Math.PI/180);
               if(this.gameState.y<1000 && this.gameState.x<1000 && this.gameState.msg===""){
          if(this.clientInfo.msg==="moved ahead"){
              this.gameState.x+=Math.sin(rotation);
              this.gameState.y+=Math.cos(rotation);
     
          }
          else if(this.clientInfo.msg==="turned right"){
               if(this.gameState.r<360){
              this.gameState.r=90;
              this.gameState.x+=Math.sin(rotation);
              this.gameState.y+=Math.cos(rotation);
               }
          }
          else if(this.clientInfo.msg==="turned left"){
               if(this.gameState.r<360){
               this.gameState.r=90;
               this.gameState.x-=Math.sin(rotation);
               this.gameState.y-=Math.cos(rotation);
               }
          }
          else if (this.clientInfo.msg==="moved behind"){
               this.gameState.r=0;
               this.gameState.x-=Math.sin(rotation);
               this.gameState.y-=Math.cos(rotation);
          };
     }
     else if(!this.gameState.msg){
          this.gameState.msg="you lost!"
          gameOver=true;
     }
          
     };
}
function gameStart(){
     if (gameLoop !== null){
          return
     }

     gameLoop=setInterval(()=>{
          for (const clientId in clients) {
               if (Client.hasOwnProperty.call(clients, clientId)) {
                    clients[clientId].gameInfo();
                    
               }
          }
          console.log(gameWorld)
               io.emit("gameUpdate",gameWorld); 
     },16);}

     gameStart();



let playerCounter=0;
let players={};
let clients={};
let gameWorld={};




     

io.on("connection",(socket)=>{
    
     playerCounter++;
     players[socket.id]=`player${playerCounter}`;
     //console.log(`${players[socket.id]} connected`);
     socket.emit("playerId",players);
      
     clients[socket.id]=new Client(players[socket.id]);
     gameWorld[players[socket.id]]=clients[socket.id].gameState;

   
     

     socket.on("details",(clientInput)=>{
          clients[socket.id].clientInfo.msg= clientInput.action;
          
          
     }); 

     socket.on("msg",(winMsg)=>{
          clients[socket.id].gameState.msg=winMsg;
          gameWorld.msg=winMsg;
          gameOver=true;
          if(gameLoop){ 
          clearInterval(gameLoop);
          gameLoop=null;
          console.log('start again');
          io.emit("gameUpdate",gameWorld);}
         
     })
     
   
     
         
     socket.on("disconnect",()=>{
          delete clients[socket.id];
          delete gameWorld[players[socket.id]];
          io.emit("gameUpdate",gameWorld);
          //console.log(gameWorld);
     })    

    

    
 
     
     
              
     });
     
    
    

     


     
     
         
    







