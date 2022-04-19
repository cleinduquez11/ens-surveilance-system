const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require("body-parser");
const session = require('express-session');
const {v4: uuidv4} = require("uuid");

const router = require('./router');

const port = 4000;

let broadcaster;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);
app.use(express.static(__dirname + "/views"));

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  socket.on("broadcaster", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  });
  socket.on("watcher", () => {
    socket.to(broadcaster).emit("watcher", socket.id);
  });
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
  socket.on("disconnect", () => {
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });
});



app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

app.use(session({
    secret: uuidv4(),
    resave:false,
    saveUninitialized:true

}));

app.use('/route', router);

//home route

app.get('/home',(req,res) => {

res.render('base', {title: "ENS"})
})

server.listen(port, () => console.log('Listening to the server on ${port}'));