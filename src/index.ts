import { WebClient } from '@slack/web-api'

interface SlackbotProps {
  token: string
  channel: string
  appName: string
}

export class SlackBot {
  private client: WebClient
  private channel: string
  private appName: string

  constructor({ token, channel, appName }: SlackbotProps) {
    this.client = new WebClient(token)
    this.channel = channel
    this.appName = appName
  }

  sendMessage(text: string) {
    return this.client.chat.postMessage({
      channel: this.channel,
      text
    })
  }

  sendErrorMessage(error: Error) {
    const tracedError = this.errorTrace(error)

    if (!tracedError.methodError) {
      this.sendMessage(`App: ${this.appName}\nError: ${tracedError.message}`)
      return
    }

    const { message, method, methodError, calledAt } = tracedError

    this.sendMessage(`App: ${this.appName}\nError: ${message}\nMethod: ${method}\nMethod error: ${methodError}\nCalled At: ${calledAt}`)
  }

  private errorTrace(error: Error) {
    const { message, stack } = error
    if (!stack) return { message }

    const [, line, origin ] = stack.split('\n')

    const method = line.substring(line.indexOf('at ') + 3, line.indexOf('('))
    const methodError = line.substring(line.indexOf('(') + 1, line.indexOf(')'))

    const calledAt = origin.substring(origin.indexOf('(') + 1, origin.indexOf(')'))

    return {
      message,
      method,
      methodError,
      calledAt
    }

  }
}