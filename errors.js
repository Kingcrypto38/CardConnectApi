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

module.exports = function errorTypeForCode(code) {
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
};
