const httpism = require("httpism");

class CardConnectApi {
  constructor({ baseUrl, merchantId, authorizationHeader }) {
    this._http = httpism.client(baseUrl, {
      headers: {
        "content-type": "application/json",
        authorization: authorizationHeader
      }
    });
    this._merchantId = merchantId;
  }

  async listTerminals() {
    const response = await this._http.post("listTerminals", {
      merchantId: this._merchantId
    });
    return response.terminals;
  }
}

module.exports = CardConnectApi;
