const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
/*Importa clase Server de la libreria socket.io*/
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);
/*La conexion con un nuevo Server y dentro de la variable io*/
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
/*Evento de conexión*/
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
/*Evento que determina cuando alguien quiere unirse a una sala*//* Data la envia el frontend a travez de la funcion emit*/
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });
/*Evento que envia el msj,solo al que esta en la misma sala*/
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
/*Evento de desconexión,cuando alguien se desconecta del servidor*/
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
