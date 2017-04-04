var express = require("express"),
    app = express(),
    fs = require("fs"),
    server = require("http").createServer(app);

var io = require("socket.io").listen(server);

var users = [];
var connections = [];

var port = process.env.PORT || 7777;

server.listen(port, function (){
    console.log(`Server running on ${port}`);
});

app.get("/", function (req, res){
    res.sendFile(__dirname + "/index.html");
});

io.sockets.on("connection", function (socket){
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  socket.on("disconnect", function (data) {

      users.splice(users.indexOf(socket.username), 1);
      updateUsers();

      connections.splice(connections.indexOf(socket), 1);
      console.log("Disconnected: %s sockets connected", connections.length);
  });
  
  // New users
  socket.on("new user", function (data, callback) {
      
      socket.username = data;
      users.push(socket.username);
      updateUsers();
    
      callback(true);
  });
  
 socket.on("send message", function (data) {
      console.log(socket.username,data);
      io.sockets.emit("new message", {msg: data, user: socket.username});
  })

   
  function updateUsers(){
      io.sockets.emit("get users", users);
  }

});
