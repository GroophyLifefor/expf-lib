import path from 'path';
import { pathToFileURL } from 'url';

export default async function (label) {
  let lib;
  if (label === 'candidate') {
    const indexJsAbsolutePath = path.resolve(process.cwd(), 'index.js');
    const indexJsFileUrl = pathToFileURL(indexJsAbsolutePath).href;
    lib = await import(indexJsFileUrl);
  } else if (label === 'lastest') {
    lib = await import('perf-test-lib');
  } else {
    throw new Error(`Unknown label: ${label}`);
  }

  const server = lib.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, world!\n');
  });

  await new Promise((resolve) => server.listen(3000, resolve));
  const url = 'http://localhost:3000';
  console.log(`Server is running at ${url}`);
  return { url, server };
}
