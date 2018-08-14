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

  it("can be cancelled by the user", async () => {
    await this.api.connectTerminal({
      hsn: process.env.TESTABLE_TERMINAL,
      force: true
    });

    console.log('> PRESS CANCEL ON THE TERMINAL NOW <')

    try {
      await this.api.readCard({
        hsn: process.env.TESTABLE_TERMINAL,
        amount: 1
      });
    } catch(e) {
      assert.equal(e.message, 'Command cancelled')
    }
  });

  it("should request a payment", async () => {
    await this.api.connectTerminal({
      hsn: process.env.TESTABLE_TERMINAL,
      force: true
    });

    console.log('> SWIPE YOUR CARD ON THE TERMINAL NOW <')

    const response = await this.api.readCard({
      hsn: process.env.TESTABLE_TERMINAL,
      amount: 1
    });

    // Sample response:
    // {
    //   token: '<redacted 16 digit number>',
    //   expiry: '<redacted 4 digit expiry date>',
    //   name: '<redacted company name? maybe?>'
    // }

    assert.equal(response.token.length, 16);
  });
});
