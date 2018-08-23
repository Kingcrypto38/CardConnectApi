# CardConnect Bolt P2PE API Wrapper

## Install

`yarn add card-connect-api`

## Usage

```
const CardConnectApi = require("card-connect-api");
```

## List all terminals

```
await this.api.listTerminals()
```

## Connect to a terminal

```
await this.api.connectTerminal({
  hsn: process.env.TESTABLE_TERMINAL,
  force: true
});
```

## Ping terminal

```
await this.api.connectTerminal({
  hsn: process.env.TESTABLE_TERMINAL,
  force: true
});
 await this.api.ping({
  hsn: process.env.TESTABLE_TERMINAL
});
```

## Read Card

```
await this.api.connectTerminal({
  hsn: process.env.TESTABLE_TERMINAL,
  force: true
});
await this.api.readCard({
  hsn: process.env.TESTABLE_TERMINAL,
  amount: 1
});
```

### Sample Response

```
{
 token: '<redacted 16 digit number>',
 expiry: '<redacted 4 digit expiry date>',
 name: '<redacted company name? maybe?>'
}
```

## Set terminal message

```
await this.api.connectTerminal({
  hsn: process.env.TESTABLE_TERMINAL,
  force: true
});
 await this.api.sendMessage({
  hsn: process.env.TESTABLE_TERMINAL,
  text: "hacked bro"
});
```

## Clear terminal message

```
await this.api.connectTerminal({
  hsn: process.env.TESTABLE_TERMINAL,
  force: true
});
await this.api.sendMessage({
  hsn: process.env.TESTABLE_TERMINAL,
  text: ""
});
```

## Errors

This wrapper returns errors for

* `User cancelled`
* `Terminal is offline`
* `Terminal is in use`
* `Something went wrong`

more information can be found [here](errors.js)
