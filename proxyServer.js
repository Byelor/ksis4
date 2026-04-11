import http from 'node:http';
import {Buffer} from 'node:buffer';
import fs from "fs";

const HOST = "0.0.0.0";
const PORT = 8080;




function fromFileToSet(path)
{
  try{
  const data = fs.readFileSync(path, {encoding: "utf-8"});
  const array = (data.split(/\r?\n/)
  .map((el)=>{ 
    const obj = el.trim()
    .toLowerCase()
    .match(/(?:https?\:\/\/)?(?:www\.)?([^\/\s]+)/);
    return obj ? obj[1] : null;
  })
).filter((el) => el !== null);
  return new Set(array);
}
  catch (error){
    console.log(`Ошибка чтения файла: ${error.message}`);
    return new Set();
  }
}

const blackList = fromFileToSet("./blackList.txt");

blackList.forEach(el => console.log(el));

function isInBlackList(host, list)
{
  return Array.from(list).includes(host);
}

const server = http.createServer();
server.on('request', (request, res) => {
  
  const {headers} = request;
  const host = headers["host"];
  console.log(host);

  

  if(isInBlackList(host, blackList))
  {
    console.log("perenapravlau");
    res.writeHead(302, {Location: '127.0.0.1:8080/blocked.html'});
    res.end();
    return;
  }


});

server.on("listening", ()=>{console.log("server starts listening!")});

server.listen(PORT, HOST);