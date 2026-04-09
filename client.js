const net = require("net");
const client = net.connect({port: 8888});
const read = require("readline");

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
