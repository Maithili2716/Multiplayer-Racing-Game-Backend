
const socket = io(); 
console.log('connecting..')

const canvas=document.querySelector(".gameBoard");
const ctx=canvas.getContext("2d");

socket.on("connect",()=>{
     console.log(`conected to server`,socket.id); 
     });

     const Track=[
          {x:170, y:0, width:300, height:100},
          {x:170,y:100,width:300,height:100},
          {x:170, y:200, width:300, height:100},
          {x:170,y:300,width:300,height:100},
          {x:170, y:400, width:300, height:100},
     ];

     Track.forEach(trackPiece => {
          ctx.fillStyle="black";
          ctx.fillRect(trackPiece.x , trackPiece.y ,trackPiece.width,trackPiece.height);
         
          
     });

document.addEventListener("keydown",(event)=>{
     if(event.key==="ArrowRight"){
     socket.emit("details",{id:socket.id,action:"turned right"});
     }
     else if(event.key==="ArrowLeft"){
     socket.emit("details",{id:socket.id,action:"turned left"});
     }
     else if (event.key==="ArrowUp"){
     socket.emit("details",{id:socket.id,action:"moved ahead"});
     }
     else if(event.key==="a"){
     socket.emit("details",{id:socket.id,action:"accelerated"});
     }
});

     socket.on("playerId",(players)=>{
           playersId=players;

     });
     let playersId={};

     socket.on("gameUpdate",(gameWorld)=>{
     console.log(`broadcasted:`,JSON.stringify(gameWorld));

     const myId=playersId[socket.id];
     const myData=gameWorld[myId];
     let cameraX=myData.x - canvas.width /2;
     let cameraY= myData.y - canvas.height/2;

     let margin=10;
     
     ctx.clearRect(0,0,canvas.width,canvas.height);

     const Track=[
          {x:170, y:0, width:300, height:100},
          {x:170,y:100,width:300,height:100},
          {x:170, y:200, width:300, height:100},
          {x:170,y:300,width:300,height:100},
          {x:170, y:400, width:300, height:100},
          {x:170,y:500,width:300,height:100}
     ]
     Track.forEach(trackPiece => {
          ctx.fillStyle="black";
          ctx.fillRect(trackPiece.x - cameraX, trackPiece.y - cameraY,trackPiece.width,trackPiece.height);
          
          
     });


  
     for (const player in gameWorld) {
     
          const playerData=gameWorld[player];
          let playerX=playerData.x - cameraX;
          let playerY=playerData.y-cameraY;
          if(player===myId){
               ctx.fillStyle="blue";
               ctx.fillRect(canvas.width/2,canvas.height/2,100,80);
               ctx.fillText(myId,canvas.width/2,canvas.height/2 - margin)
              
              
          }
          else{
               ctx.fillStyle="red";
               ctx.fillRect(playerX,playerY,100,80)
               ctx.fillText(player,playerX,playerY-margin)
              
              
          }
     }

});



