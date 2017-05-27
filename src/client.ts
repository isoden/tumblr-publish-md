/**
 * @file CLIクライアント
 */

import * as tumblr from 'tumblr.js'
import * as chalk from 'chalk'
import * as inquirer from 'inquirer'
import * as Preferences from 'preferences'
import { isString, isObject } from 'lodash'
import { Observable } from 'rxjs/Rx'

const prefs = new Preferences<{ blogIdentifier: string; credentials: tumblr.Credentials }>('io.github.isoden/tumblr-cli')

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
   * 投稿者情報を登録する
   */
  register() {
    return this.shouldRegister()
      .mergeMap(() => this.prompt())
  }

  /**
   * ヘルプメッセージの内容を返す
   */
  getHelpContent(): string {
    return `
Usage:
  tumblr-cli [--version] [--help]
`
  }

  /**
   * API リクエストに必要な情報の入力を受け付ける
   */
  private prompt(): Observable<void> {
    const requiredValidator = (input: string) => isString(input) && input.length > 0

    return Observable.fromPromise(
      inquirer.prompt([
        {
          name    : 'blogIdentifier',
          type    : 'input',
          message : 'input your blog identifier (e.g.: example.tumblr.com)',
          validate: requiredValidator,
        },
        {
          name    : 'consumer_key',
          type    : 'password',
          message : 'input your consumer_key',
          validate: requiredValidator,
        },
        {
          name    : 'consumer_secret',
          type    : 'password',
          message : 'input your consumer_secret',
          validate: requiredValidator,
        },
        {
          name    : 'token',
          type    : 'password',
          message : 'input your token',
          validate: requiredValidator,
        },
        {
          name    : 'token_secret',
          type    : 'password',
          message : 'input your token_secret',
          validate: requiredValidator,
        },
      ])
      .then(({ blogIdentifier, ...credentials }) => {
        prefs.blogIdentifier = <string>blogIdentifier
        prefs.credentials    = <tumblr.Credentials>credentials
      })
    )
  }

  /**
   * 登録処理を実行すべきか判断する
   *
   * @return Observable<true=登録処理に進む/false=登録処理をスキップ>
   */
  private shouldRegister(): Observable<boolean> {
    return isString(prefs.blogIdentifier) && isObject(prefs.credentials)
      ? Observable.fromPromise(
          inquirer.prompt([
            {
              name   : 'confirm',
              type   : 'confirm',
              message: chalk.yellow(`It's already registered. Do you want to overwrite?`),
            }
          ])
        )
        .map(result => result.confirm)
      : Observable.of(true)
  }
}
