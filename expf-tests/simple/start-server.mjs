import path from 'path';
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

  const server = lib.http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, world!\n');
  });

  await new Promise((resolve) => server.listen(3000, resolve));
  const url = 'http://localhost:3000';
  console.log(`Server is running at ${url}`);
  return { url, server };
}
