/**
 * @file マークダウンの投稿情報をパースする
 */

import * as tumblr from 'tumblr.js'
import * as toml   from 'toml'
import * as yaml   from 'js-yaml'
import { pick }    from 'lodash'

export class MdFileParser {
  static parseMd(markdown: string, format?: MdFileParser.MetaFormat): MdFileParser.ParsedData {
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

    const meta = MdFileParser.parseMeta(s1.substring(0, metaTail.index!), format)
    const body = s1.substring(metaTail.index! + metaTail[0].length)

    return { meta, body }
  }

  static parseMeta(metaData: string, format: MdFileParser.MetaFormat = 'toml'): MdFileParser.MetaData {
    let parsedMeta: tumblr.CreateTextPostParams

    switch (format) {
      case 'toml':
        parsedMeta = toml.parse(metaData)
        break

      case 'yaml':
        parsedMeta = yaml.safeLoad(metaData)
        break

      default:
        throw new Error(`format is one of the following 'toml' or 'yaml'.`)
    }

    return MdFileParser.normalizeMeta(parsedMeta)
  }

  private static normalizeMeta(metaData: MdFileParser.MetaData): tumblr.CreateTextPostParams {
    metaData = pick(metaData, ['title', 'body', 'type', 'state', 'tags', 'tweet', 'date', 'format', 'slug', 'native_inline_images'])

    if (Array.isArray(metaData.tags)) {
      metaData.tags = metaData.tags.join(',')
    }

    return <tumblr.CreateTextPostParams>metaData
  }
}

export declare namespace MdFileParser {
  export type MetaFormat = 'toml' | 'yaml'
  export interface MetaData {
    [key: string]: any
  }
  export interface ParsedData {
    body: string
    meta: MetaData
  }
}
