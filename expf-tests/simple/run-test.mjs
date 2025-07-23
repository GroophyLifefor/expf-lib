import { PerfTestTemplate } from './templates/autocannon.mjs';

function createSimpleServer(lib) {
  return lib.http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, world!\n');
  });
}

PerfTestTemplate.runTest(createSimpleServer);
