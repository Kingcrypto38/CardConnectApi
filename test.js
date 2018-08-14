const assert = require("assert");
const CardConnectApi = require("./CardConnectApi.js");

describe("CardConnectApi", () => {
  beforeEach(() => {
    this.api = new CardConnectApi({
      baseUrl: process.env.BASE_URL,
      merchantId: process.env.MERCHANT_ID,
      authorizationHeader: process.env.AUTHORIZATION
    });
  });

  it("should list all terminals", async () => {
    const terminals = await this.api.listTerminals();
    assert(terminals.length > 0);
  });

  it("should connect to a terminal", async () => {
    const response = await this.api.connectTerminal({
      hsn: process.env.TESTABLE_TERMINAL,
      force: true
    });

    assert(response.connected);
  });

  it("should send a message to a terminal", async () => {
    await this.api.connectTerminal({
      hsn: process.env.TESTABLE_TERMINAL,
      force: true
    });
    const response = await this.api.sendMessage({
      hsn: process.env.TESTABLE_TERMINAL,
      text: "hacked bro"
    });

    assert(response.delivered);
  });

  it("should ping the terminal", async () => {
    await this.api.connectTerminal({
      hsn: process.env.TESTABLE_TERMINAL,
      force: true
    });
    const response = await this.api.ping({
      hsn: process.env.TESTABLE_TERMINAL
    });

    assert(response.connected);
  });

  it.only("should request a payment", async () => {
    this.timeout = 10000;
    await this.api.connectTerminal({
      hsn: process.env.TESTABLE_TERMINAL,
      force: true
    });
    const response = await this.api.readCard({
      hsn: process.env.TESTABLE_TERMINAL,
      amount: 1
    });

    assert(response.connected);
  });
});
