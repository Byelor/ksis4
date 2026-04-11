import http from 'node:http';
import {Buffer} from 'node:buffer';
import fs from "fs";

const HOST = "0.0.0.0";
const PORT = 8080;




function fromFileToSet(path)
{
  try{
  const data = fs.readFileSync(path, {encoding: "utf-8"});
  return new Set(data.split(/\r?\n/).map((el)=>{ 
    return el.trim().toLowerCase().match(/(?<=http\:\/\/?).+(?=\/?)/);
  }));
}
  catch (error){
    console.log(`Ошибка чтения файла: ${error.message}`);
    return new Set();
  }
}

const blackList = fromFileToSet("./blackList.txt");

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