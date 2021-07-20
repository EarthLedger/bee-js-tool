//const BeeJs = require("@ethersphere/bee-js");
const commandLineArgs = require('command-line-args')
const request = require("node-fetch");
const fs = require("fs");

const options = commandLineArgs([
  { name: 'start', alias: 's', type: Number },
  { name: 'end', alias: 'e', type: Number },
  { name: 'port_start', alias: 'p', type: Number, defaultValue: 1635 },
]);

console.log("options:", options);
const queryPeerAddress = async (port) => {
  try {
    let result = await request(`http://localhost:${port}/addresses`);
    let res = await result.json();
    console.log(res);
    // parser out address
    return res.overlay;
    
  } catch (e) {
    console.error("queryPeerAddress err:", e);
    return "";
  }
};

(async () => {
  let result = [];
  for (let i = options.start; i <= options.end; i++) {
    let port = options.port_start + i * 3;
    let addr = await queryPeerAddress(port);
    result.push(addr);
  }

  // write to file
  fs.writeFileSync(`./output/${options.start}-${options.end}.json`, JSON.stringify(result));
})();



