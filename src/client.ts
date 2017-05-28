/**
 * @file CLIクライアント
 */

import * as fs                             from 'fs'
import * as path                           from 'path'
import * as chalk                          from 'chalk'
import * as tumblr                         from 'tumblr.js'
import * as inquirer                       from 'inquirer'
import * as minimist                       from 'minimist'
import * as Preferences                    from 'preferences'
import { isString, isObject, isNil, pick } from 'lodash'
import { Observable }                      from 'rxjs/Rx'
import { ApiClient }                       from './api-client'
import { MdFileParser }                    from './md-file-parser'

const prefs = new Preferences<{ blogIdentifier: string; credentials: tumblr.Credentials }>('io.github.isoden/tumblr-publish-md')

const api = new ApiClient(
  prefs.blogIdentifier,
  prefs.credentials,
)

export class Client {
  /**
   * シングルトン用のインスタンス
   */
  static readonly instance = new Client()

  /**
   * クライアントのバージョン
   */
  readonly version = 'v1.0.0-beta.1'

  /**
   * クライアントを返す
   */
  static getClient(): Client {
    return Client.instance
  }

  private constructor() {}

  /**
   * コマンドライン引数の値をうけとり処理を実行する
   * @param args ユーザー入力
   */
  exec(args: minimist.ParsedArgs): void {
    if (args.init) {
      this.init().subscribe(() => {
        console.log('Successed!')
        process.exit()
      }, err => {
        console.error(err)
        process.exit(1)
      })
    } else if (args.version) {
      console.log(this.version)
      process.exit()
    } else if (args.help) {
      console.log(this.getHelpContent())
      process.exit()
    } else {
      this.post(args._[0], args.type, args.format).subscribe(() => {
        console.log('Successed!')
        process.exit()
      }, err => {
        console.log(err && err.message || err)
        process.exit(1)
      })
    }
  }

  /**
   * 環境の初期設定を行う
   */
  private init(): Observable<void> {
    return this.shouldRegister()
      .mergeMap(() => this.prompt())
  }

  /**
   * 指定されたファイルの内容を投稿する
   * @param filepath ファイルパス
   * @param type     投稿タイプ
   * @param format   メタ情報の記述フォーマット
   */
  private post(filepath?: string, type: tumblr.PostParams['type'] = 'text', metaFormat?: 'toml' | 'yaml'): Observable<any> {
    if (isNil(filepath)) {
      return Observable.throw('filepath is required')
    }

    const readFileAsObservable = Observable.bindNodeCallback<string, string, Buffer>(fs.readFile)

    return readFileAsObservable(path.join(process.cwd(), filepath), 'utf8')
      .mergeMap(fileBuffer => {
        switch (type) {
          case 'text': {
            const { meta, body } = this.parseMarkdownFile(fileBuffer.toString(), metaFormat)
            const params = <{ title?: string; body: string } & tumblr.PostParams>pick({
              ...meta,
              body,
              format: 'markdown',
            }, ['title', 'body', 'type', 'state', 'tags', 'tweet', 'date', 'format', 'slug', 'native_inline_images'])

            return api.createTextPost(params)
          }
        }

        return Observable.throw(`'${ type }' is unknown type!`)
      })
  }

  /**
   * ヘルプメッセージの内容を返す
   */
  private getHelpContent(): string {
    return `
Usage:
  tumblr-publish-md [filepath] [options...]
  tumblr-publish-md [Command]

Command:
  -i, --init   : Initialize for cli settings.
  -h, --help   : Show this help.
  -v, --version: Show cli version.
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

  /**
   * マークダウンの情報をパースする
   * @param markdown   マークダウンのファイル内容
   * @param metaFormat メタ情報の記述フォーマット
   */
  private parseMarkdownFile(markdown: string, metaFormat?: MdFileParser.MetaFormat): MdFileParser.ParsedData {
    return MdFileParser.parseMd(markdown, metaFormat)
  }
}
