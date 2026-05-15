const http = require('http');

const data = JSON.stringify({
  userInput: "hello",
  context: { tasks: [], events: [], notes: [], currentView: "dashboard" }
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => console.log("Response:", body));
});

req.on('error', (e) => console.error("Error:", e.message));
req.write(data);
req.end();
