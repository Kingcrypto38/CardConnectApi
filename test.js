const assert = require("assert");
const CardConnectApi = require("./CardConnectApi.js");

describe("CardConnectApi", function() {
  beforeEach(function() {
    this.api = new CardConnectApi({
      baseUrl: process.env.BASE_URL,
      merchantId: process.env.MERCHANT_ID,
      authorizationHeader: process.env.AUTHORIZATION
    });
  });

  it("should list all terminals", async function() {
    const terminals = await this.api.listTerminals();
    assert(terminals.length > 0);
  });

  it("should connect to a terminal", async function() {
    await this.api.connectTerminal({
      hsn: process.env.TESTABLE_TERMINAL,
      force: true
    });
  });

  it("sets the terminal message", async function() {
    await this.api.connectTerminal({
      hsn: process.env.TESTABLE_TERMINAL,
      force: true
    });
    await this.api.sendMessage({
      hsn: process.env.TESTABLE_TERMINAL,
      text: "hacked bro"
    });
  });

  it("clears the terminal message", async function() {
    await this.api.connectTerminal({
      hsn: process.env.TESTABLE_TERMINAL,
      force: true
    });
    await this.api.sendMessage({
      hsn: process.env.TESTABLE_TERMINAL,
      text: ""
    });
  });

  it("should ping the terminal", async function() {
    await this.api.connectTerminal({
      hsn: process.env.TESTABLE_TERMINAL,
      force: true
    });
    const response = await this.api.ping({
      hsn: process.env.TESTABLE_TERMINAL
    });

    assert(response.connected);
  });

  describe("tests that require manual intervention", function() {
    this.timeout(300000);

    it("can be cancelled by the user", async function() {
      await this.api.connectTerminal({
        hsn: process.env.TESTABLE_TERMINAL,
        force: true
      });

      console.log("> PRESS CANCEL ON THE TERMINAL NOW <");

      try {
        await this.api.readCard({
          hsn: process.env.TESTABLE_TERMINAL,
          amount: 1
        });
      } catch (e) {
        assert.equal(e.message, "User cancelled");
      }
    });

    it("should request a card present payment", async function() {
      await this.api.connectTerminal({
        hsn: process.env.TESTABLE_TERMINAL,
        force: true
      });

      console.log("> SWIPE YOUR CARD ON THE TERMINAL NOW <");

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

    it("should request a manual card payment", async function() {
      await this.api.connectTerminal({
        hsn: process.env.TESTABLE_TERMINAL,
        force: true
      });

      console.log("> ENTER YOUR CARD ON THE TERMINAL NOW <");

      const response = await this.api.readManual({
        hsn: process.env.TESTABLE_TERMINAL,
        amount: 1
      });

      assert.equal(response.token.length, 16);
    });
  });
});
