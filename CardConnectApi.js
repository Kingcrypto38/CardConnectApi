const httpism = require("httpism");
const errorTypeForCode = require("./errors");

class CardConnectApi {
  constructor({ baseUrl, merchantId, authorizationHeader }) {
    this._authorizationHeader = authorizationHeader;
    this._baseUrl = baseUrl;
    this._merchantId = merchantId;

    const requestHeadersMiddleware = (request, next) => {
      request.headers["content-type"] = "application/json";
      request.headers["authorization"] = this._authorizationHeader;
      if (this._sessionKey) {
        request.headers["x-cardconnect-sessionkey"] = this._sessionKey;
      }
      return next();
    };

    const errorsMiddleware = async (request, next) => {
      try {
        return await next();
      } catch (e) {
        const ErrorType = errorTypeForCode(e.body && e.body.errorCode);
        throw new ErrorType();
      }
    };

    this._client = httpism.client(this._baseUrl);
    this._client.use(requestHeadersMiddleware);
    this._client.use(errorsMiddleware);
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
  }

  async sendMessage({ hsn, text }) {
    const response = await this._client.post("display", {
      merchantId: this._merchantId,
      hsn,
      text
    });
  }

  async readCard({ hsn, amount }) {
    return this._client.post("readCard", {
      merchantId: this._merchantId,
      hsn,
      amount
    });
  }

  async readManual({ hsn, amount }) {
    return this._client.post("readManual", {
      merchantId: this._merchantId,
      hsn,
      amount
    });
  }

  async ping({ hsn }) {
    return this._client.post("ping", {
      merchantId: this._merchantId,
      hsn
    });
  }
}

module.exports = CardConnectApi;
