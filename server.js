const express= require('express')

const app = express()
const http =require('http').createServer(app)
const PORT =process.env.PORT ||3900

http.listen(PORT , ()=>{
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})

//socket//

const io = require('socket.io')(http)
var users={};
io.on('connection',(socket)=>{
    console.log('Connected...')
    socket.on("new-user-joined",(username)=>{
        users[socket.id]=username;
        console.log(users);
        socket.broadcast.emit('user-connected',username);
        io.emit("user-list",users);
    });
    socket.on("disconnect",()=>{
        socket.broadcast.emit('user-disconnected', user=users[socket.id]);
        delete users[socket.id];
        io.emit("user-list",users);
    })
    socket.on('message',(data)=>{
        socket.broadcast.emit("message",{user:data.user,msg:data.msg});
    })
});