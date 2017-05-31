/**
 * @file ユーティリティー関数のエントリーポイント
 */

import * as tumblr from 'tumblr.js'
import { parse }   from 'jekyll-markdown-parser'
import { pick }    from 'lodash'

export interface PostMeta {
  [key: string]: any
}

export function parseMarkdown(markdownWithMeta: string): { body: string; meta: PostMeta } {
  const { markdown, parsedYaml } = parse(markdownWithMeta)

  return {
    body: markdown,
    meta: normalizeYamlMeta(parsedYaml),
  }
}

export function normalizeYamlMeta(meta: PostMeta) {
  const metaWhiteList = ['title', 'body', 'type', 'state', 'tags', 'tweet', 'date', 'format', 'slug', 'native_inline_images']
  const pickedMeta    = <PostMeta>pick(meta, metaWhiteList)

  if (Array.isArray(pickedMeta.tags)) {
    pickedMeta.tags = pickedMeta.tags.join(',')
  }

  return <tumblr.CreateTextPostParams>pickedMeta
}
