
const socket = io(); 
console.log('connecting..')

          socket.on("connect",()=>{
          console.log(`conected to server`,socket.id);
          });

const inputRight=document.querySelector(".right");
const inputLeft=document.querySelector(".left");
const inputAhead=document.querySelector(".ahead");
const inputAccelerate=document.querySelector(".accelerate");

inputRight.addEventListener("click",()=>{
    console.log( socket.emit("details",`client ${socket.id} turned right`));
});
inputLeft.addEventListener("click",()=>{
     socket.emit("details",`client ${socket.id} turned left`);
})
inputAhead.addEventListener("click",()=>{
     socket.emit("details",`client ${socket.id} moved ahead`);
})
inputAccelerate.addEventListener("click",()=>{
     socket.emit(`details`,`client ${socket.id} accelerated`);
})

socket.on("details",(arg)=>{
     console.log(`broadcasted:`,arg);
})