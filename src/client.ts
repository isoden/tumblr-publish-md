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
import * as yaml                           from 'js-yaml'
import * as toml                           from 'toml'
import { isString, isObject, isNil, pick } from 'lodash'
import { Observable }                      from 'rxjs/Rx'
import { ApiClient }                       from './api-client'

const prefs = new Preferences<{ blogIdentifier: string; credentials: tumblr.Credentials }>('io.github.isoden/tumblr-publish-md')

const api = new ApiClient(
  prefs.blogIdentifier,
  prefs.credentials,
)

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
    } else if (args.post) {
      this.post(args.post, args.type).subscribe(() => {
        console.log('Successed!')
        process.exit()
      }, err => {
        console.log(err && err.message || err)
        process.exit(1)
      })
    } else if (args.version) {
      console.log(this.version)
      process.exit()
    } else if (args.help) {
      console.log(this.getHelpContent())
      process.exit()
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
   */
  private post(filepath?: string, type: tumblr.PostParams['type'] = 'text'): Observable<any> {
    if (isNil(filepath)) {
      return Observable.throw('filepath is required')
    }

    const readFileAsObservable = Observable.bindNodeCallback<string, string, Buffer>(fs.readFile)

    return readFileAsObservable(path.join(process.cwd(), filepath), 'utf8')
      .mergeMap(fileBuffer => {
        switch (type) {
          case 'text': {
            const { meta, body } = this.splitMetaAndBody(fileBuffer.toString())
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
  tumblr-publish-md [Command] [file]


Command:
  -i, --init   : Initialize for cli settings.
  -p, --post   : Post new content
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
   * 投稿のメタ情報をパースする
   * @param meta メタ情報の文字列表現
   */
  private parseMetaInfo(meta: string): { [key: string]: string } {
    if (/^\w+\s*:/.test(meta)) {
      return yaml.safeLoad(meta)
    } else if (/^\w+\s*=/.test(meta)) {
      return toml.parse(meta)
    }

    throw new Error('invalid markdown format')
  }

  /**
   * マークダウンのメタ情報と本文を分ける
   * @param markdown マークダウンのファイル内容
   */
  private splitMetaAndBody(markdown: string): { meta: { [key: string]: any }; body: string } {
    /*! @license https://github.com/bouzuya/jekyll-markdown-parser/blob/master/LICENSE */
    const separator = new RegExp(/^(?:\+\+\+|---)\s*$\n/m)
    const metaHead  = markdown.match(separator)

    if (metaHead === null) {
      return { body: markdown, meta: {} }
    }

    const s1       = markdown.substring(metaHead.index! + metaHead[0].length)
    const metaTail = s1.match(separator)

    if (metaTail === null) {
      return { body: markdown, meta: {} }
    }

    const meta = this.parseMetaInfo(s1.substring(0, metaTail.index!))
    const body = s1.substring(metaTail.index! + metaTail[0].length)

    return { meta, body }
  }
}
