import autocannon from 'autocannon';
import { argv } from 'process';
import { pathToFileURL } from 'url';

class PerfTestTemplate {
  constructor(label, config) {
    this.label = label;
    this.server = null;
    this.config = config;
    this.url = `http://localhost:${config.port}`;
    this.lib = null;

    console.log(`Running performance test with label: ${label}`);
  }

  async loadLib() {
    if (this.label === 'candidate') {
      this.lib = await import(pathToFileURL('/app/index.js').href);
    } else if (this.label === 'latest') {
      this.lib = await import('perf-test-lib');
    } else {
      throw new Error(`Unknown label: ${this.label}`);
    }
  }

  async startServer(serverFactory) {
    await this.loadLib();
    this.server = serverFactory(this.lib);
    await new Promise((resolve) => this.server.listen(this.config.port, resolve));
    console.log(`Server is running at ${this.url}`);
  }

  async run() {
    try {
      const result = await autocannon({
        url: this.url,
        connections: 10,
        duration: 5,
      });

      console.log(autocannon.printResult(result));
      return result;
    } catch (err) {
      console.error('Autocannon error:', err);
    }
  }

  async report(result) {
    console.log('Raw Data');
    console.log('---start:expf-autocanon-data---');
    console.log(JSON.stringify(result, null, 2));
    console.log('---end:expf-autocanon-data---');
  }

  async stop() {
    if (this.server) {
      this.server.close(() => {
        console.log('Server closed');
      });
    } else {
      console.warn('No server to close');
    }
  }

  static async runTest(serverFactory, config = { port: 3000 }) {
    const label = argv[2];
    const test = new PerfTestTemplate(label, config);

    try {
      await test.startServer(serverFactory);
      const data = await test.run();
      await test.report(data);
      await test.stop();
    } catch (error) {
      console.error('Test execution error:', error);
      await test.stop();
      process.exit(1);
    }
  }
}

export { PerfTestTemplate };