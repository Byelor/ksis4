const net = require("net");
const read = require("readline");

/** @type {net.NetConnectOpts} */
const options = {

    host: "127.0.0.2",
    port: "8888",

    localAddress: "127.0.0.1",
    localPort: 12344

};

const client = net.createConnection(options, ()=>{
    console.log(`IP address: ${options.localAddress} Port: ${options.localPort}`);
})


const rl = read.createInterface({
    input: process.stdin,
    output: process.stdout,
});

client.write(process.argv[2]);

rl.on('line', (line)=>{
    client.write(line);
    console.log(line);
});

client.on("data", (data)=>
{
    console.log(data.toString());
})