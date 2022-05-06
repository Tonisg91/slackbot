interface SlackbotProps {
    token: string;
    channel: string;
    appName: string;
}
export declare class SlackBot {
    private client;
    private channel;
    private appName;
    constructor({ token, channel, appName }: SlackbotProps);
    sendMessage(text: string): Promise<import("@slack/web-api").ChatPostMessageResponse>;
    sendErrorMessage(error: Error): void;
    private errorTrace;
}
export {};
