#!/usr/bin/env node

import * as minimist from 'minimist'
import { Client } from './client'

const client = Client.getClient()
const args   = minimist(process.argv.slice(2), {
  alias: {
    v: 'version',
    h: 'help',
    i: 'init',
    p: 'post',
  }
})

client.exec(args)
