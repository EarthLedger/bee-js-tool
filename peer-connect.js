const commandLineArgs = require('command-line-args')
const request = require("node-fetch");
const fs = require("fs");

const options = commandLineArgs([
  { name: 'start', alias: 's', type: Number },
  { name: 'end', alias: 'e', type: Number },
  { name: 'port_start', alias: 'p', type: Number, defaultValue: 1635 },
	{ name: 'peers_file', alias: 'f', type: String }
]);

console.log("options:", options);
const connectPeer = async (port, peer) => {
  try {
		console.log("connecting:", port, peer);
    let result = await request(`http://localhost:${port}/connect${peer}`, { method: 'POST' });
    let res = await result.json();
    console.log(res);    
  } catch (e) {
    console.error("queryPeerAddress err:", e);
    return "";
  }
};

(async () => {
  // read out peer addresses
	let addr = JSON.parse(fs.readFileSync(options.peers_file));
  for (let i = options.start; i <= options.end; i++) {
    let port = options.port_start + i * 3;
		addr.peers.forEach(peer => {
			await connectPeer(port, peer);
		});
  }
})();