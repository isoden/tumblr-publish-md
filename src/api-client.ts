/**
 * @file Tumblr の Web API クライアント
 */

import * as tumblr from 'tumblr.js'
import { Observable } from 'rxjs/Rx'

// tumblr.Client を継承して定義したいが、 tumblr.Client の実装方法がよろしくないのでプライベートフィールドから参照する方法にした。
// tumblr.Client のインスタンスメソッドが prototype ではなく、 クラスのプロパティとして宣言されているので、
// 子クラスで親クラスのメソッドをオーバーライドしたメソッドを定義して実行すると、 プロトタイプチェーンを見に行く前にプロパティのメソッドが参照されるので子クラスのメソッドが実行されない問題がある。
export class ApiClient {
  private client: tumblr.Client

  constructor(
    private blogIdentifier: string,
    credentials: tumblr.Credentials,
  ) {
    this.client = tumblr.createClient({
      credentials,
      returnPromises: true,
    })
  }

  blogInfo(params?: Object): Observable<tumblr.Response.BlogInfo> {
    return Observable.fromPromise(this.client.blogInfo(this.blogIdentifier, params))
  }

  blogAvater(size?: number, params?: Object): Observable<tumblr.Response.BlogAvatar> {
    return Observable.fromPromise(this.client.blogAvatar(this.blogIdentifier, size, params))
  }
}
