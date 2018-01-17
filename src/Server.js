const Client = require('./client');

class Server extends Client {
  constructor(config) {
    super(config);
    this.handlers = {};
  }
  /**
   * Handle pub-sub protocol
   * @param {string} listenOn
   * @param {string} respondTo
   * @param {function} handler - can be async, Ciceu!
   */
  sub(listenOn, respondTo, handler) {
    this.subscribe(listenOn);
    this.on(listenOn, async (message) => {
      const response = await handler(message);
      this.publish(respondTo || listenOn.replace('/in', '/out'), response);
    });
  }
  /**
   * Handle request-response protocol
   * @param {string} listenOn
   * @param {function} handler - can be async, Ciceu!
   */
  res(listenOn, handler) {
    this.subscribe(listenOn);
    this.on(listenOn, async (message) => {
      const { replyTo, requestId, body } = JSON.parse(message);
      const payload = await handler(body);
      this.response(replyTo, { requestId, payload });
    });
  }

  /**
   * @param {string} topic
   * @param {function} handler - can be async, Ciceu!
   */
  listen(topic, handler) {
    this.subscribe(topic);
    this.on(topic, handler);
  }
}

module.exports = config => new Server(config);
