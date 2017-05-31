#!/usr/bin/env node

import * as fs              from 'fs'
import * as path            from 'path'
import * as meow            from 'meow'
import * as chalk           from 'chalk'
import * as Preferences     from 'preferences'
import * as inquirer        from 'inquirer'
import * as tumblr          from 'tumblr.js'
import * as dateFns         from 'date-fns'
import { EventEmitter2 }    from 'eventemitter2'
import { Observable }       from 'rxjs/Observable'
import { isString, padEnd } from 'lodash'

import { parseMarkdown } from './utils'
import { ApiClient }     from './api-client'

interface Config {
  blogIdentifier: string
  credentials: tumblr.Credentials
}

function readRelativeFileSync(filename: string, encoding?: string): string {
  const file = fs.readFileSync(path.resolve(process.cwd(), filename), encoding)

  return file.toString()
}

const main = new class extends EventEmitter2 {
  private config = new Preferences<Config>('io.github.isoden/tumblr-publish-md')

  on(event: string, listener: (apiClient: ApiClient, options: meow.Result['flags']) => Promise<any>): this {
    super.on(event, options => {
      this.inputAuthInfo()
        .then(config => listener(new ApiClient(config.blogIdentifier, config.credentials), options))
    })

    return this
  }

  inputAuthInfo(): Promise<Config> {
    const { config } = this

    // 認証情報入力済み
    if (config.blogIdentifier && config.credentials) {
      return Promise.resolve(config)
    }

    const notEmptyValidator = (input: string) => isString(input) && input.length > 0

    return inquirer.prompt([
      {
        name    : 'blogIdentifier',
        type    : 'input',
        message : 'input your blog identifier (e.g.: example.tumblr.com)',
        validate: notEmptyValidator,
      },
      {
        name    : 'consumer_key',
        type    : 'password',
        message : 'input your consumer_key',
        validate: notEmptyValidator,
      },
      {
        name    : 'consumer_secret',
        type    : 'password',
        message : 'input your consumer_secret',
        validate: notEmptyValidator,
      },
      {
        name    : 'token',
        type    : 'password',
        message : 'input your token',
        validate: notEmptyValidator,
      },
      {
        name    : 'token_secret',
        type    : 'password',
        message : 'input your token_secret',
        validate: notEmptyValidator,
      },
    ])
    .then(({ blogIdentifier, ...credentials }) => {
      config.blogIdentifier = <string>blogIdentifier
      config.credentials    = <tumblr.Credentials>credentials
      return config
    })
  }

  dispose() {
    this.removeAllListeners()
  }
}()

const cli = meow(`
  ## Usage
    $ tumblr-publish-md <input>

  ## Options
    --help   , -h: Show this help
    --version, -v: Show cli version

  ## Example

  ### Post
    $ tumblr-publish-md post --file source/hello-world.md

  ### Show Pulished Posts
    $ tumblr-publish-md ls-remote
    415869124166 2017-05-31 Hello World! Ep.3
    340829163716 2017-05-30 Hello World! Ep.2
    256314326581 2017-05-29 Hello World! Ep.1

  ### Update
    $ tumblr-publish-md update --file source/hello-world.md --id 415869124166

  ### Delete
    $ tumblr-publish-md delete --id 415869124166
`, {
  alias: {
    v: 'version',
    h: 'help',
  }
})

main
  // 投稿処理
  .on('post', (apiClient, options) => {
    const { file, ...params } = options
    const markdown = readRelativeFileSync(file)

    const { body, meta } = parseMarkdown(markdown)

    return apiClient.createTextPost({
      ...meta,
      ...params,
      body,
    })
    .do(() => console.log(chalk.green('Post successed!')))
    .toPromise()
  })

  // 投稿一覧取得
  .on('ls-remote', (apiClient, options) => {
    const { type, ...params } = options

    return apiClient.blogPosts(type, params)
      .do(res => {
        res.posts.map(({ id, state, title, date }) => {
          // tslint:disable-next-line:max-line-length
          console.log(`${ chalk.blue(id + '') } ${ chalk.white(dateFns.format(date, 'YYYY-MM-DD')) } ${ chalk.green(padEnd(state, 9)) } ${ chalk.white(title + '') }`)
        })
      })
      .toPromise()
  })

  // 投稿更新処理
  .on('update', (apiClient, options) => {
    const { file, id, ...params } = options
    const markdown = readRelativeFileSync(file)

    const { body, meta } = parseMarkdown(markdown)

    // ID と一致する投稿があるかチェック
    return apiClient.blogPosts(void 0, { id })
      .catch(() => Observable.throw(new Error('No Post found')))
      .mergeMap((res: tumblr.Response.BlogPosts) => {
        const { posts } = res

        // 更新に同意するか尋ねる
        return Observable.fromPromise(inquirer.prompt([
          {
            name   : 'confirm',
            message: `Are you sure you want to update '${ posts[0].title }'`,
            type   : 'confirm'
          }
        ]))
        .map(answer => answer.confirm)
        .do(confirmed => {
          if (!confirmed) {
            throw new Error('You should agree to update')
          }
        })
      })
      .mergeMap(() => {
        // 更新に同意したときのみ更新APIを実行する
        return apiClient.editPost({
          ...meta,
          ...params,
          id,
          body,
        })
      })
      .do(() => console.log(chalk.green('Update successed!')))
      .toPromise()
  })

Observable.fromPromise(main.emitAsync(cli.input[0], cli.flags))
  .finally(() => main.dispose())
  .subscribe({
    error(err) {
      console.error(err && err.message || err)
    }
  })
