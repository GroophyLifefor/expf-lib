import { PerfTestTemplate } from './templates/autocannon.mjs';

function createSimpleServer(lib) {
  function runMiddleware(req, res, middlewares, handler) {
    let i = 0;
    function next() {
      if (i < middlewares.length) {
        middlewares[i++](req, res, next);
      } else {
        handler(req, res);
      }
    }
    next();
  }

  const middlewareCount = 5; // Number of middleware functions to run
  const middlewares = Array.from({ length: middlewareCount }).fill(
    (req, res, next) => next()
  );

  return lib.http.createServer((req, res) => {
    runMiddleware(req, res, middlewares, (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hello, world!\n');
    });
  });
}

PerfTestTemplate.runTest(createSimpleServer);
