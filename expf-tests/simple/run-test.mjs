import autocannon from "autocannon";

async function run() {
  // Start server
  const test = await import('./start-server.mjs');
  const {
    server,
    url
  } = await test.default();

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
