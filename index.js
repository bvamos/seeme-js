const https = require('https');
const crypto = require('crypto');

const GATEWAY_URL_HOST = 'seeme.hu';
const GATEWAY_URL_PATH = '/gateway';
const CHECKSUM_LENGTH = 4;
const API_VERSION = '2.0.1';
const RESPONSE_FORMAT = 'json';

class SeeMeGateway {
  constructor(options) {
    options = options || {};
    this.apiKey = options.apiKey;
    this.apiUrlHost = options.apiUrlHost || GATEWAY_URL_HOST;
    this.apiUrlPath = options.apiUrlPath || GATEWAY_URL_PATH;

    if (!this.apiKey) {
      throw new Error('API key required');
    }

    if (!this.validateApiKey(this.apiKey)) {
      throw new Error('Invalid API key');
    }
  }

  /**
   * 
   * @param {*} mobileNumber 
   * @param {*} message 
   * @param {*} sender 
   * @param {*} reference 
   * @param {*} callbackParams 
   * @param {*} callbackURL 
   */
  sendSMS(mobileNumber, message, sender = '', reference = null, callbackParams = null, callbackURL = null) {
    const params = {};
    params.apiVersion = API_VERSION;
    params.format = RESPONSE_FORMAT;
    params.key = this.apiKey;
    params.number = mobileNumber;
    params.message = message;

    if (sender) {
      params.sender = sender;
    }

    if (reference) {
      params.reference = reference;
    }

    if (callbackParams) {
      params.callback = callbackParams;
    }

    if (callbackURL) {
      params.callbackurl = callbackURL;
    }

    return this.callAPI(params);
  }

  getBalance() {
    const params = {};
    params.apiVersion = API_VERSION;
    params.format = RESPONSE_FORMAT;
    params.key = this.apiKey;
    params.method = 'balance';

    return this.callAPI(params);
  }

  setIP(ip) {
    const params = {};
    params.apiVersion = API_VERSION;
    params.format = RESPONSE_FORMAT;
    params.key = this.apiKey;
    params.method = 'setip';
    params.ip = ip;

    return this.callAPI(params);
  }

  callAPI(params) {
    const searchParams = new URLSearchParams(params);
    const options = {
      method: 'GET',
      protocol: 'https:',
      host: this.apiUrlHost,
      path: this.apiUrlPath + '?' + searchParams.toString()
    };

    return new Promise(function(resolve, reject) {
      var req = https.request(options, (res) => {
        // reject on bad status
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error('statusCode=' + res.statusCode));
        }
        // cumulate data
        var body = [];
        res.on('data', (chunk) => {
          body.push(chunk);
        });
        // resolve on end
        res.on('end', () => {
          try {
            //body = JSON.parse(Buffer.concat(body).toString());
            body = Buffer.concat(body).toString();
          } catch(e) {
            reject(e);
          }
          resolve(body);
        });
      });
      // reject on request error
      req.on('error', (err) => {
          // This is not a "Second reject", just a different sort of failure
          reject(err);
      });
      // IMPORTANT
      req.end();
    });
  }

  /**
   * 
   * @param {*} apiKey 
   */
  validateApiKey(apiKey) {
    const key = apiKey.substr(0, apiKey.length-CHECKSUM_LENGTH);
    const checksum = apiKey.substr(apiKey.length-CHECKSUM_LENGTH);
    return (crypto.createHash('md5').update(key).digest('hex').substr(0, CHECKSUM_LENGTH) === checksum);
  }
}

module.exports = SeeMeGateway;
