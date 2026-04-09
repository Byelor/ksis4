const net = require('net');
const server = net.createServer();

/** @type {Map<import('net').Socket, string>} */
const socketMap = new Map();

server.once('listening', ()=> {console.log("server starts listening!");});

server.listen(8888);

function sendAll(except, message)
{
    for(const [socket, name] of socketMap)
    {
        if(socket != except)
        {
            socket.write(message);
        }
    }
}

server.on('connection', (socket)=>{
    
    console.log("new connection!");

    socket.once("data", (name)=>{
        socketMap.set(socket, name);
        
        console.log(`New user: ${name}`);

        socket.on('data', (data)=>
    {   

        const message = `\n${name}: ${data.toString()}`;
        console.log(message);
        sendAll(socket, message);

    })
    });
    
    socket.on('close', ()=>
    {
        console.log(`${socketMap.get(socket)} disconnected!`);
    });


})