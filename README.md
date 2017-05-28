tumblr-cli
===

Tumblr client for CLI

[![npm](https://img.shields.io/npm/v/tumblr-cli.svg?style=flat-square)](https://github.com/isoden/tumblr-cli)
[![license](https://img.shields.io/github/license/isoden/tumblr-cli.svg?style=flat-square)](https://github.com/isoden/tumblr-cli)

[WIP]
This Project is under development :hammer_and_wrench:

## Installation

```console
$ npm install tumblr-cli --global
```

## Usage

### Setup

#### 1. Register Tumblr App

- https://www.tumblr.com/oauth/register

#### 2. Get your `consumer_key`, `consumer_secret`, `token`, and `token_secret`.

- https://api.tumblr.com/console/calls/user/info

#### 3. Initialize tumblr-cli

```console
$ tumblr-cli --init
```

### Post

```console
$ tumblr-cli --post source/hello-world.md
```

## License

[Under The MIT License](https://isoden.mit-license.org/2017)
