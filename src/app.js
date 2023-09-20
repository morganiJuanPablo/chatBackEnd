import express from "express";
import { __dirname } from "./utils.js";
import path from "path";
import { engine } from "express-handlebars";
import { viewsRouter } from "./routes/viewsRouter.routes.js";
import { Server } from "socket.io";

const port = process.env.PORT || 8080;
const app = express();

//midlewares

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public"))); //=> /chat/src/public
const httpServer = app.listen(port, () =>
  console.log(`Servidor escuchando en el puerto ${port}`)
);

//configuración handlebars
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views")); //=> /chat/src/views

//routes, siempre debajo del motor de plantillas
app.use(viewsRouter);

const io = new Server(httpServer);
const historialChat = [];
io.on("connection", (socket) => {
  //cuando se conecta el usuario, le enviamos el historial del chat
  socket.emit("historyChat", historialChat);
  socket.on("messageChat", (data) => {
    historialChat.push(data);
    //enviamos el historial del chat a todos los usuarios conectados
    io.emit("historyChat", historialChat);
  });

  //recibimos la coneccion del cliente
  socket.on("userConected",(data)=>{
    socket.broadcast.emit("newUser", `El usuario ${data} se acaba de conectar`)
  })
});
