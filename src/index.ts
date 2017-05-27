#!/usr/bin/env node

import * as minimist from 'minimist'
import { Client } from './client'

const argv = minimist(process.argv.slice(2), {
  alias: {
    v: 'version',
    h: 'help',
  }
})

const client = Client.getClient()

if (argv.version) {
  console.log(client.version)
  process.exit()
}

if (argv.help) {
  console.log(client.getHelpContent())
  process.exit()
}
