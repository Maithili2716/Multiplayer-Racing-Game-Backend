
const socket = io(); 
console.log('connecting..')

          socket.on("connect",()=>{
          console.log(`conected to server`,socket.id);
          });

const inputRight=document.querySelector(".right");
const inputLeft=document.querySelector(".left");
const inputAhead=document.querySelector(".ahead");
const inputAccelerate=document.querySelector(".accelerate");

let clientInput={
     id:socket.id,
     action:"move",
};

document.addEventListener("keydown",(event)=>{
     if(event.key==="ArrowRight"){
     clientInput.action="turned right";
     socket.emit("details",clientInput);
     }
     else if(event.key==="ArrowLeft"){
     clientInput.action= "turned left";
     console.log(event.key);
     socket.emit("details",clientInput);
     }
     else if (event.key==="ArrowUp"){
     clientInput.action= "moved ahead";
     socket.emit("details",clientInput);
     }
     else if(event.key==="a"){
     clientInput.action= "accelerated";
     console.log(event.key)
     socket.emit("details",clientInput);
     }
});

  


socket.on("gameUpdate",(gameWorld)=>{
     console.log(`broadcasted:`,JSON.stringify(gameWorld));
});