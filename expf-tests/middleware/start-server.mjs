import { pathToFileURL } from 'url';

export default async function (label) {
  let lib;
  if (label === 'candidate') {
    lib = await import(pathToFileURL('/app/index.js').href);
  } else if (label === 'latest') {
    lib = await import('perf-test-lib');
  } else {
    throw new Error(`Unknown label: ${label}`);
  }

  // Example middleware function
  function middleware(req, res, next) {
    next();
  }

  // Simple middleware runner
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
  const middlewares = Array.from({ length: middlewareCount }).fill(middleware);

  const server = lib.http.createServer((req, res) => {
    runMiddleware(req, res, middlewares, (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hello, world!\n');
    });
  });

  await new Promise((resolve) => server.listen(3000, resolve));
  const url = 'http://localhost:3000';
  console.log(`Server is running at ${url}`);

  return { url, server };
}
