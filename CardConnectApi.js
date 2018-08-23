const httpism = require("httpism");

function CommandCancelledError() {
  this.name = "CommandCancelledError";
  this.message = "User cancelled";
  this.stack = new Error().stack;
}

function TerminalOfflineError() {
  this.name = "TerminalOfflineError";
  this.message = "Terminal is offline";
  this.stack = new Error().stack;
}

function TerminalInUseError() {
  this.name = "TerminalInUseError";
  this.message = "Terminal is in use";
  this.stack = new Error().stack;
}

function TerminalGeneralError() {
  this.name = "TerminalGeneralError";
  this.message = "Something went wrong";
  this.stack = new Error().stack;
}

CommandCancelledError.prototype = new Error();

function errorTypeForCode(code) {
  if (code === 8) {
    return CommandCancelledError;
  }
  if (code === 7) {
    return TerminalInUseError;
  }
  if (code === 6) {
    return TerminalOfflineError;
  }
  return TerminalGeneralError;
}

class CardConnectApi {
  constructor({ baseUrl, merchantId, authorizationHeader }) {
    this._authorizationHeader = authorizationHeader;
    this._baseUrl = baseUrl;
    this._merchantId = merchantId;
    this._http = this._createClient();
  }

  async listTerminals() {
    return this._post("listTerminals", {
      merchantId: this._merchantId
    }).then(response => response.terminals);
  }

  async connectTerminal({ hsn, force }) {
    return this._post("connect", {
      merchantId: this._merchantId,
      hsn,
      force
    }).then(response => {
      this._sessionKey = response.headers["x-cardconnect-sessionkey"].split(
        ";"
      )[0];
      return response.statusCode === 200 ? true : false;
    });
  }

  async sendMessage({ hsn, text }) {
    return this._post("display", {
      merchantId: this._merchantId,
      hsn,
      text
    }).then(response => {
      return response.statusCode === 200 ? true : false;
    });
  }

  async readCard({ hsn, amount }) {
    return this._post("readCard", {
      merchantId: this._merchantId,
      hsn,
      amount
    });
  }

  async ping({ hsn }) {
    return this._post("ping", {
      merchantId: this._merchantId,
      hsn
    });
  }

  get _client() {
    return this._createClient();
  }

  _post(path, options) {
    return this._client.post(path, options).catch(e => {
      const errorType = errorTypeForCode(e.body.errorCode);
      throw { error: new errorType() };
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
