const Client = require('./client');

class Server {
  constructor(options) {
    const { hostname, connection } = options;
    this.client = new Client(hostname, connection);
    this.handlers = {};
  }
  /**
   * @param {string} listenOn
   * @param {string} respondTo
   * @param {function} handler - can be async, Ciceu!
   */
  sub(listenOn, respondTo, handler) {
    this.client.subscribe(listenOn);
    this.client.on(listenOn, async (message) => {
      const response = await handler(message);
      this.client.publish(respondTo || listenOn.replace('/in', '/out'), response);
    });
  }
  /**
   * @param {string} listenOn
   * @param {function} handler - can be async, Ciceu!
   */
  res(listenOn, handler) {
    this.client.subscribe(listenOn);
    this.client.on(listenOn, async (message) => {
      const { replyTo, requestId, body } = JSON.parse(message);
      const payload = await handler(body);
      this.client.response(replyTo, { requestId, payload });
    });
  }
}

module.exports = options => new Server(options);
