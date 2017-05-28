/**
 * @file マークダウンの投稿情報をパースする
 */

import * as toml from 'toml'
import * as yaml from 'js-yaml'

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
    switch (format) {
      case 'toml':
        return toml.parse(metaData)

      case 'yaml':
        return yaml.safeLoad(metaData)

      default:
        throw new Error(`format is one of the following 'toml' or 'yaml'.`)
    }
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
