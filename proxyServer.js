import http from 'node:http';
import {Buffer} from 'node:buffer';
import fs from "fs";

const HOST = "0.0.0.0";
const PORT = Number(process.argv[2]);

const html = fs.readFileSync("./blocked.html");


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

console.log("\n\nBlackList:")
blackList.forEach(el => console.log(el));
console.log("===================\n\n");
function isInBlackList(host, list)
{
  return list.has(host);
}

const server = http.createServer();
server.on('request', (request, res) => {
  
  const {headers} = request;
  
  const host = headers["host"];
  if (!host) { res.writeHead(400); res.end(); return; }
  const {url} = request;

  const fullUrl = new URL(url, `http://${host}`);
if(isInBlackList(fullUrl.hostname, blackList)) {
    res.writeHead(403, { 
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': Buffer.byteLength(html) 
    });
    console.log(`${fullUrl} - ${res.statusCode} ${res.statusMessage}`);
    res.end(html);
    return;
}

  
  const options = {
    host: fullUrl.hostname,
    port: fullUrl.port || 80,
    method: request.method,
    headers: headers,
    path: fullUrl.pathname + fullUrl.search

  }
  
  const innerRequest = http.request(options, (innerResponse)=>{
    res.writeHead(innerResponse.statusCode, innerResponse.headers);
    innerResponse.pipe(res);
    console.log(`${url} - ${res.statusCode} ${res.statusMessage}`);
  });
  innerRequest.on("error",(error)=>{
    console.log(`Error! ${error.message}`);
    res.end();
  })

  request.pipe(innerRequest);
});

server.on("listening", ()=>{console.log("server starts listening!")});

server.listen(PORT, HOST);