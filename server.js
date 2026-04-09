const net = require('net');
const server = net.createServer();

const mySet = new Set();

server.once('listening', ()=> {console.log("server starts listening!");});

server.listen(8888);

server.on('connection', (socket)=>{
    console.log("new connection!");
})