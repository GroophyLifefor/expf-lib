import path from 'path';
import { pathToFileURL } from 'url';

export default async function () {
  const indexJsAbsolutePath = path.resolve(process.cwd(), 'index.js');
  const indexJsFileUrl = pathToFileURL(indexJsAbsolutePath).href;
  const libDefault = await import(indexJsFileUrl);

  const server = libDefault.http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, world!\n');
  });

  await new Promise(resolve => server.listen(3000, resolve));
  const url = 'http://localhost:3000';
  console.log(`Server is running at ${url}`);
  return { url, server };
}
