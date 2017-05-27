/**
 * @file CLIクライアント
 */

export class Client {
  /**
   * 唯一のインスタンス
   */
  static instance = new Client()

  /**
   * クライアントのバージョン
   */
  readonly version = 'v0.0.1'

  /**
   * クライアントを返す
   */
  static getClient(): Client {
    return Client.instance
  }

  private constructor() {}

  /**
   * ヘルプメッセージの内容を返す
   */
  getHelpContent(): string {
    return `
Usage:
  tumblr-cli [--version] [--help]
`
  }
}
