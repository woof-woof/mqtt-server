const EventEmitter = require('events');
const { connect } = require('mqtt');
/**
 * MQTT Client
 */
class Client extends EventEmitter {
  /**
   * @param {string} hostname
   * @param {object} config
   */
  constructor(config) {
    super();
    const { hostname, options } = config;
    // initalize class members
    this.client = connect(hostname, options);
    /** {@link https://github.com/mqttjs/MQTT.js#mqttclientpublishtopic-message-options-callback} */
    this.publish = this.client.publish.bind(this.client);
    /** {@link https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback} */
    this.subscribe = this.client.subscribe.bind(this.client);
    // attach event handlers
    this.client.on('message', this.onMessage.bind(this));
  }
  onMessage(topic, buffer) {
    const message = buffer.toString();
    return this.emit(topic, message);
  }
  /**
   * Send response
   * @param {string} topic
   * @param {object} response
   */
  response(topic, response) {
    this.publish(topic, JSON.stringify(response));
  }
}

module.exports = Client;
