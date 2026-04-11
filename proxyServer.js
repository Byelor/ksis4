import http from 'node:http';
import {Buffer} from 'node:buffer';
import fs from "fs";

const HOST = "0.0.0.0";
const PORT = 8080;


const blackList = new Set();

blackList.add("neverssl.com");
function isInBlackList(url, list)
{
  return Array.from(list).includes(url);
}

const server = http.createServer();
server.on('request', (request, res) => {
  
  const {headers} = request;
  const host = headers["host"];
  console.log(host);


  if(isInBlackList(host, blackList))
  {
    console.log("perenapravlau");
    res.writeHead(302, {Location: 'https://www.404s.design/'});
    res.end();
    return;
  }


});

server.on("listening", ()=>{console.log("server starts listening!")});

server.listen(PORT, HOST);