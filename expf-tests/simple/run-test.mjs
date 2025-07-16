import autocannon from "autocannon";
import { argv } from 'process';

const label = argv[2];

async function run() {
  // Start server
  const test = await import('./start-server.mjs');
  const {
    server,
    url
  } = await test.default(label);

  try {
    const result = await autocannon({
      url,
      connections: 10,
      duration: 5,
    });

    console.log(autocannon.printResult(result));
  } catch (err) {
    console.error("Autocannon error:", err);
  } finally {
    server.close();
  }
}

run();
