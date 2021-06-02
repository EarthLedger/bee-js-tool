//const BeeJs = require("@ethersphere/bee-js");
const commandLineArgs = require('command-line-args')
const request = require("node-fetch");
const fs = require("fs");

const options = commandLineArgs([
  { name: 'start', alias: 's', type: Number },
  { name: 'end', alias: 'e', type: Number },
  { name: 'ip', alias: 'i', type: String },
  { name: 'port_start', alias: 'p', type: Number, defaultValue: 1635 },
]);

console.log("options:", options);
const queryPeerAddress = async (port) => {
  try {
    let result = await request(`http://localhost:${port}/addresses`);
    let res = await result.json();
    console.log(res);
    // parser out address
    let peerAddr = res.underlay[0];
    // "/ip4/172.24.33.198/tcp/1634/p2p/16Uiu2HAmHxMLCr8VSATMyMif8J6iJZC5VJ8356DK8YDjajUrdYAc",
    return peerAddr.replace(/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\//, `/${options.ip}/`);
  } catch (e) {
    console.error("queryPeerAddress err:", e);
    return "";
  }
};

(async () => {
  let result = {
    peers: []
  } 
  for (let i = options.start; i <= options.end; i++) {
    let port = options.port_start + i * 3;
    let addr = await queryPeerAddress(port);
    result.peers.push(addr);
  }

  // write to file
  fs.writeFileSync(`./output/${options.ip}-${options.start}-${options.end}.json`, JSON.stringify(result));
})();



