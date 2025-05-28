const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Node.js App is Running!");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
