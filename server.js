const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
const { join } = require("path");
const { Server } = require("socket.io");
const io = new Server(server, {
    origins: `${
        process.env.NODE_ENV == 'production' ? 'SPECIFY ONCE DEPLOYED' : 'http://127.0.0.1'
    }:*`
});

const { un, pw } = process.env.NODE_ENV === "production" ? process.env : require("./secrets.json")
app.use(express.static("./public"));
app.use(express.json());

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // might at some point use a session cookie
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, "/public/index.html"))
});

app.post('/post.json', (req,res)=>{
    const user = req.socket.remoteAddress;
    const { username, password, imgUrl } = req.body;
    // check if img contains an animal and no explicit content
    console.log("username:", username);
    console.log("password:", password);
    console.log("imgUrl:", imgUrl);
    if(!imgUrl) return res.json({msg:"🙈 you forgot to send along an img"});
    if(!username || !password || username !== un || password !== pw) return res.json({msg:"something went wrong with your credentials"})
    if (username === un && password === pw && imgUrl){
        io.emit("newImg", { imgUrl, user });
        res.json({msg:"🪄 Yeah that worked and your image was sent"});
    } else {
        // res.sendStatus(403);
        res.json({msg:"👎 sry but that didn't work"})
    }
})
server.listen(PORT, () => {
  console.log('listening on:', PORT);
});
