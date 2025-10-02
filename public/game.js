
const socket = io(); 
console.log('connecting..')

const canvas=document.querySelector(".gameBoard");
const displayMsg=document.querySelector(".msg")
const restart=document.querySelector(".restart");
const ctx=canvas.getContext("2d");

const Track=[
     {x:-50, y: 0, width:300,height:100,style:"gray"},
     {x:-50, y: 100, width:300,height:100,style:"gray"},
     {x:-50 , y: 200, width:300,height:100,style:"gray"},
     {x:-50 , y: 300, width:300,height:100,style:"gray"},
     {x:-50 , y: 400, width:300,height:100,style:"gray"},

     {x:250, y:400 , width:300,height:100,style:"gray"},
     {x:550, y:400 , width:300,height:100,style:"gray"},

     {x:550, y:300 , width:300,height:100,style:"gray"},

     {x: 550, y: 200, width:300,height:100,style:"gray"},
     {x: 550, y: 100, width:300,height:100,style:"gray"},

     {x:550, y:0 , width:300,height:100,style:"gray"},
     {x:750, y:0, width:300,height:100,style:"gray"},
     {x:870, y: 0, width:25,height:100,style:"red"},
   
     {x:-50, y:0 , width:300,height:100,style:"gray"},

     
]

     function drawTree(x, y, trunkHeight=50, trunkWidth=20, canopyRadius=20) {
    
     ctx.fillStyle = 'sienna'; 
     
     const trunkX = x - (trunkWidth / 2);
     const trunkY = y - trunkHeight; 
     
     ctx.fillRect(trunkX, trunkY, trunkWidth, trunkHeight);
     
     ctx.fillStyle = 'forestgreen'; 
     
     const canopyCenterX = x;
     const canopyCenterY = trunkY; 
     ctx.beginPath();
     ctx.arc(canopyCenterX, canopyCenterY, canopyRadius, 0, Math.PI * 2);
     ctx.fill();
     }

     trees=[
          {x:-50,y:0},
          {x:-50,y:100},
          {x:-50,y:200},
          {x:-50,y:300},
          {x:-50,y:400},
          {x:250,y:0},
          {x:250,y:100},
          {x:250,y:200},{x:250,y:300},{x:250,y:400},
          {x:550,y:0},
          {x:550,y:100},
          {x:550,y:200},
          {x:550,y:300},
          {x:550,y:400},
          {x:850,y:200},
          {x:850,y:300},
          {x:850,y:400}
     ]

socket.on("connect",()=>{
     console.log(`conected to server`,socket.id); 
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
     else if(event.key==="ArrowDown"){
     socket.emit("details",{id:socket.id,action:"moved behind"});
     }
});




     socket.on("playerId",(players)=>{
          ids=players;
     })

     let ids={};

     socket.on("gameUpdate",(gameWorld)=>{
     console.log(`broadcasted:`,JSON.stringify(gameWorld));
     let Display=gameWorld.msg;


     const myId= ids[socket.id];
     const myData=gameWorld[myId];

     if(Display&& Display.length>0){
          canvas.style.display="none";
          displayMsg.innerText=Display;
          displayMsg.style.display="block"
          restart.style.display="block";

     }

     restart.addEventListener("click",()=>{
          
          window.location.href="./index.html"

     })


     if (!myId || !gameWorld[myId]) {
          return;
      }

     
     

     cameraX=myData.x- (canvas.width/2);
     cameraY=myData.y- (canvas.height/2);


     ctx.clearRect(0,0,canvas.width,canvas.height);


     
     Track.forEach(trackPiece => {
          ctx.fillStyle=trackPiece.style;
          ctx.fillRect(trackPiece.x-cameraX,trackPiece.y-cameraY,trackPiece.width,trackPiece.height)
          
     });

     trees.forEach(tree => {
          drawTree(tree.x-cameraX+10,tree.y-cameraY+10);
          
     });



     const playerwidth= 40;
     const playerheight=25;

     for (const player in gameWorld) {

            const playerData=gameWorld[player];

               if (playerData.msg){
                    continue
               }
            
               let screenX=0;
               let screenY=0;
               let Style="";
               const margin=10;
               let text="";
           
               if(player===myId){
                   Style="blue"
                   text=myId;
                   screenX=canvas.width/2;
                   screenY=canvas.height/2;

               }else{
                   Style="red"
                   text=player;
                   screenX=playerData.x - cameraX;
                   screenY=playerData.y-cameraY;

               }

               ctx.fillStyle=Style;
               ctx.fillRect(screenX-(playerwidth/2),screenY- (playerheight)/2,playerwidth,playerheight)
               ctx.fillText(text,screenX,screenY-playerheight/2-margin)
          }

          const P_HALF_W = playerwidth / 2;
          const P_HALF_H = playerheight / 2;
          const P_LEFT   = canvas.width / 2 - P_HALF_W;
          const P_RIGHT  = canvas.width / 2 + P_HALF_W;
          const P_TOP    = canvas.height / 2 - P_HALF_H;
          const P_BOTTOM = canvas.height / 2 + P_HALF_H;
          
          Track.forEach(trackPiece => {
              if (trackPiece.style === "red") {
                  
                  const T_LEFT   = trackPiece.x - cameraX;
                  const T_RIGHT  = T_LEFT + trackPiece.width;
                  const T_TOP    = trackPiece.y - cameraY;
                  const T_BOTTOM = T_TOP + trackPiece.height;
                  
                  if (
                      P_RIGHT > T_LEFT  && 
                      P_LEFT  < T_RIGHT &&  
                      P_BOTTOM > T_TOP  &&  
                      P_TOP   < T_BOTTOM   
                  ) {
                      const winMsg = `${myId} won`;
                      socket.emit("msg", winMsg);
                  }
              }
          });
          
     
}
); 








