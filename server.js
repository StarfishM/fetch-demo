const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.port || 8080;
const { join } = require("path");
const { Server } = require("socket.io");
const io = new Server(server);
const { un, pw } = process.env.NODE_ENV === "production" ? process.env : require("./secrets.json")
app.use(express.static("./public"));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, "/public/index.html"))
});

app.post('/post.json', (req,res)=>{
    console.log("made a post request");
    const user = req.socket.remoteAddress;
    const { username, password, imgUrl } = req.body;
    if (username === un && password === pw && imgUrl){
        io.emit("newImg", { imgUrl, user });
        res.json({success:true});
    } else {
        res.sendStatus(403);
    }
})
server.listen(PORT, () => {
  console.log('listening on:', PORT);
});
