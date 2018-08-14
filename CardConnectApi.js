const httpism = require("httpism");

class CardConnectApi {
  constructor({ baseUrl, merchantId, authorizationHeader }) {
    this._authorizationHeader = authorizationHeader;
    this._baseUrl = baseUrl;
    this._merchantId = merchantId;
    this._http = this._createClient();
  }

  async listTerminals() {
    const response = await this._createClient().post("listTerminals", {
      merchantId: this._merchantId
    });

    return response.terminals;
  }

  async connectTerminal({ hsn, force }) {
    const response = await this._createClient().post("connect", {
      merchantId: this._merchantId,
      hsn,
      force
    });

    this._sessionKey = response.headers["x-cardconnect-sessionkey"].split(";");

    return {
      connected: response.statusCode === 200 ? true : false
    };
  }

  async sendMessage({ hsn, text }) {
    const response = await this._createClient().post("display", {
      merchantId: this._merchantId,
      hsn,
      text
    });

    return {
      delivered: response.statusCode === 200 ? true : false
    };
  }

  async ping({ hsn }) {
    return this._createClient().post("ping", {
      merchantId: this._merchantId,
      hsn
    });
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
