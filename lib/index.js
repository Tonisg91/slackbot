"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackBot = void 0;
const web_api_1 = require("@slack/web-api");
class SlackBot {
    constructor({ token, channel, appName }) {
        this.client = new web_api_1.WebClient(token);
        this.channel = channel;
        this.appName = appName;
    }
    sendMessage(text) {
        return this.client.chat.postMessage({
            channel: this.channel,
            text
        });
    }
    sendErrorMessage(error) {
        const tracedError = this.errorTrace(error);
        if (!tracedError.methodError) {
            this.sendMessage(`App: ${this.appName}\nError: ${tracedError.message}`);
            return;
        }
        const { message, method, methodError, calledAt } = tracedError;
        this.sendMessage(`App: ${this.appName}\nError: ${message}\nMethod: ${method}\nMethod error: ${methodError}\nCalled At: ${calledAt}`);
    }
    errorTrace(error) {
        const { message, stack } = error;
        if (!stack)
            return { message };
        const [, line, origin] = stack.split('\n');
        const method = line.substring(line.indexOf('at ') + 3, line.indexOf('('));
        const methodError = line.substring(line.indexOf('(') + 1, line.indexOf(')'));
        const calledAt = origin.substring(origin.indexOf('(') + 1, origin.indexOf(')'));
        return {
            message,
            method,
            methodError,
            calledAt
        };
    }
}
exports.SlackBot = SlackBot;
