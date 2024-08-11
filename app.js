const express = require('express') ;
const app  = express() ;
const path = require("path") ;

// http used for socketio

/* socketio setup (7 - 13) */
const http = require("http") ;

const socketio = require("socket.io") ;

const server = http.createServer(app) ;

const io = socketio(server) ;

// performing ejs
app.set("view engine" , "ejs") ;

// setting public folder
app.set(express.static(path.join(__dirname , "public"))) ;

// io -> socket io server
io.on("connection" , function(socket)
{
    socket.on("send-location" , function(data){
        io.emit("recieve-location" , {id : socket.id , ...data}) ;
    })
    // console.log("connected") ;

    // when disconnected -> we have to remove socket.id server
    socket.on("disconnect" , function(){
        io.emit("user-disconnected" , socket.id) ;
    }) ;
}) ;

app.get("/" , function(req , res){
    res.render("index") ;
})

server.listen(3000) ;