/**
 * @file Tumblr の Web API クライアント
 */

import * as tumblr from 'tumblr.js'
import { Observable } from 'rxjs/Rx'

// tumblr.Client を継承して定義したいが tumblr.Client のクラスの実装方法がよろしくないのでプライベートフィールドから参照する。
// tumblr.Client のインスタンスメソッドが prototype 上ではなく、クラスのプロパティとして宣言されているので、
// const api = new class extends tumblr.ApiClient {
//   blogInfo() {
//     console.log('not executed...')
//   }
// }
// api.blogInfo()
// を実行するとプロパティのメソッドが参照されるので子クラスのメソッドが実行されない
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
