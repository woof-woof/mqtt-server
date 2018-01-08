const EventEmitter = require('events');
const { connect } = require('mqtt');
/**
 * MQTT Client
 */
class Client extends EventEmitter {
  /**
   * @param {string} host
   * @param {object} config
   */
  constructor(host, config) {
    super();
    // initalize class members
    this.client = connect(host, config);
    // attach event handlers
    this.client.on('message', this.onMessage.bind(this));
  }
  onMessage(topic, buffer) {
    const message = buffer.toString();
    return this.emit(topic, message);
  }
  /**
   * Publish message
   * @param {string} topic
   * @param {string} message
   */
  publish(topic, message) {
    this.client.publish(topic, message);
  }
  /**
   * Send response
   * @param {string} topic
   * @param {object} response
   */
  response(topic, response) {
    this.publish(topic, JSON.stringify(response));
  }
  subscribe(topic) {
    this.client.subscribe(topic);
  }
}

module.exports = Client;
