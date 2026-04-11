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
  const {url} = request;

  if(isInBlackList(host, blackList))
  {
    console.log("perenapravlau");
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(fs.readFileSync("./blocked.html", {encoding: "utf-8"}));
    res.end();
    return;
  }

  const options = {
    host: host,
    port: 80,
    method: request.method,
    headers: headers,
    path: url
  }
  
  const innerRequest = http.request(options, (innerResponse)=>{
    res.writeHead(innerResponse.statusCode, innerResponse.headers);
    innerResponse.pipe(res);

  });
  innerRequest.on("error",(error)=>{
    console.log(`Error! ${error.message}`);
    res.end();
  })

  request.pipe(innerRequest);
});

server.on("listening", ()=>{console.log("server starts listening!")});

server.listen(PORT, HOST);