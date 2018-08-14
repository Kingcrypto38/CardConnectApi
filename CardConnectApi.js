const httpism = require("httpism");

function CommandCancelledError() {
  this.name = 'CommandCancelledError';
  this.message = 'Command cancelled';
  this.stack = (new Error()).stack;
}
CommandCancelledError.prototype = new Error;

function errorTypeForCode(code) {
  if (code === 8) {
    return CommandCancelledError
  }
}

class CardConnectApi {
  constructor({ baseUrl, merchantId, authorizationHeader }) {
    this._authorizationHeader = authorizationHeader;
    this._baseUrl = baseUrl;
    this._merchantId = merchantId;
    this._http = this._createClient();
  }

  async listTerminals() {
    const response = await this._client.post("listTerminals", {
      merchantId: this._merchantId
    });

    return response.terminals;
  }

  async connectTerminal({ hsn, force }) {
    const response = await this._client.post("connect", {
      merchantId: this._merchantId,
      hsn,
      force
    });
    this._sessionKey = response.headers["x-cardconnect-sessionkey"].split(
      ";"
    )[0];

    return {
      connected: response.statusCode === 200 ? true : false
    };
  }

  async sendMessage({ hsn, text }) {
    const response = await this._client.post("display", {
      merchantId: this._merchantId,
      hsn,
      text
    });

    return {
      delivered: response.statusCode === 200 ? true : false
    };
  }

  async readCard({ hsn, amount }) {
    try {
      const response = await this._client.post("readCard", {
        merchantId: this._merchantId,
        hsn,
        amount
      });
      return response;
    } catch (e) {
      const errorType = errorTypeForCode(e.body.errorCode)
      if (errorType) {
        throw new errorType()
      }

      throw e;
    }
  }

  async ping({ hsn }) {
    return this._client.post("ping", {
      merchantId: this._merchantId,
      hsn
    });
  }

  get _client() {
    return this._createClient();
  }

  _createClient() {
    const defaultHeaders = {
      "content-type": "application/json",
      authorization: this._authorizationHeader
    };
    const headerWithSessionKey = Object.assign({}, defaultHeaders, {
      "x-cardconnect-sessionkey": this._sessionKey
    });

    return httpism.client(this._baseUrl, {
      headers: this._sessionKey ? headerWithSessionKey : defaultHeaders
    });
  }
}

module.exports = CardConnectApi;
