#!/usr/bin/env node

import * as minimist from 'minimist'
import { Client } from './client'

const argv = minimist(process.argv.slice(2), {
  alias: {
    v: 'version',
    h: 'help',
    i: 'init',
  }
})

const client = Client.getClient()

switch (argv._[0]) {
  case 'init': {
    client.init().subscribe(() => {
      console.log('Successed!')
      process.exit()
    }, err => {
      console.error(err)
      process.exit(1)
    })

    break
  }

  case 'post': {
    client.post(argv._[1], argv.type).subscribe(() => {
      console.log('Successed!')
      process.exit()
    }, err => {
      console.log(err && err.message || err)
      process.exit(1)
    })

    break
  }
}

if (argv.version) {
  console.log(client.version)
  process.exit()
}

if (argv.help) {
  console.log(client.getHelpContent())
  process.exit()
}
