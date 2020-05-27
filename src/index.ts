import * as https from 'https';
import * as crypto from 'crypto';

const GATEWAY_URL_HOST = 'seeme.hu';
const GATEWAY_URL_PATH = '/gateway';
const CHECKSUM_LENGTH = 4;
const API_VERSION = '2.0.1';
const RESPONSE_FORMAT = 'json';

/**
 * Configuration options
 */
export interface SeeMeGatewayOptions {
  /**
   * API key generated on seeme.hu
   */
  apiKey: string;
  /**
   * API hostname. Defaults to seeme.hu
   */
  apiUrlHost?: string;
  /**
   * API path. Defaults to /gateway
   */
  apiUrlPath?: string;
  apiVersion?: string;
}

/**
 * API URL parameters. See https://seeme.hu/tudastar/reszletek/sms-gateway-parameterek
 */
export interface SeeMeGatewayParams {
  apiVersion: string;
  key: string;
  message?: string;
  number?: number;
  sender?: string;
  callback?: string;
  callbackurl?: string;
  reference?: string;
  method?: string;
  format?: string;
  ip?: string;
}

/**
 * API Client
 */
export class SeeMeGateway {
  private options: SeeMeGatewayOptions;

  constructor(options: SeeMeGatewayOptions) {
    this.options = options || <SeeMeGatewayOptions>{};

    if (!this.options.apiKey) {
      throw new Error('API key required');
    }

    if (!this.validateApiKey(this.options.apiKey)) {
      throw new Error('Invalid API key');
    }

    if (!this.options.apiUrlHost) {
      this.options.apiUrlHost = GATEWAY_URL_HOST;
    }

    if (!this.options.apiUrlPath) {
      this.options.apiUrlPath = GATEWAY_URL_PATH;
    }
  }

  /**
   * Sends SMS. See parameters at https://seeme.hu/tudastar/reszletek/sms-gateway-parameterek
   * @param mobileNumber 
   * @param message 
   * @param sender 
   * @param reference 
   * @param callbackParams 
   * @param callbackURL 
   */
  sendSMS(mobileNumber: number, message: string, sender = '', reference = null, callbackParams = null, callbackURL = null): Promise<any> {
    const params: SeeMeGatewayParams = {
      apiVersion: API_VERSION,
      key: this.options.apiKey,
      message,
      number: mobileNumber,
      format: RESPONSE_FORMAT
    };

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

  /**
   * Get actual balance. See at https://seeme.hu/tudastar/reszletek/sms-gateway-egyenleg-lekerdezes
   */
  getBalance(): Promise<any> {
    const params: SeeMeGatewayParams = {
      apiVersion: API_VERSION,
      key: this.options.apiKey,
      method: 'balance',
      format: RESPONSE_FORMAT,
    };

    return this.callAPI(params);
  }

  /**
   * 
   * @param ip 
   */
  setIP(ip: string): Promise<any> {
    const params: SeeMeGatewayParams = {
      apiVersion: API_VERSION,
      key: this.options.apiKey,
      method: 'setip',
      ip,
      format: RESPONSE_FORMAT,
    };

    return this.callAPI(params);
  }

  /**
   * Calls the HTTP service
   * @param params API parameters
   */
  private callAPI(params: SeeMeGatewayParams): Promise<any> {
    const searchParams = new URLSearchParams(<any>params);
    const options = {
      method: 'GET',
      protocol: 'https:',
      host: this.options.apiUrlHost,
      path: this.options.apiUrlPath + '?' + searchParams.toString()
    };

    return new Promise((resolve, reject) => {
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
          let responseJson = {};
          try {
            responseJson = JSON.parse(Buffer.concat(body).toString());
          } catch(e) {
            reject(e);
          }
          resolve(responseJson);
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
   * Validate an API key
   * @param apiKey API key generated on seeme.hu
   * @returns True if success, otherwise False
   */
  private validateApiKey(apiKey: string): boolean {
    const key = apiKey.substr(0, apiKey.length-CHECKSUM_LENGTH);
    const checksum = apiKey.substr(apiKey.length-CHECKSUM_LENGTH);
    return (crypto.createHash('md5').update(key).digest('hex').substr(0, CHECKSUM_LENGTH) === checksum);
  }
}