tumblr-publish-md
===

Publish markdown file to Tumblr

[![npm](https://img.shields.io/npm/v/tumblr-publish-md.svg?style=flat-square)](https://github.com/isoden/tumblr-publish-md)
[![license](https://img.shields.io/github/license/isoden/tumblr-publish-md.svg?style=flat-square)](https://github.com/isoden/tumblr-publish-md)

[WIP]
This Project is under development :hammer_and_wrench:

## Installation

```console
$ npm install tumblr-publish-md --global
```

## Usage

### Setup

#### 1. Register Tumblr App

- https://www.tumblr.com/oauth/register

#### 2. Get your `consumer_key`, `consumer_secret`, `token`, and `token_secret`.

- https://api.tumblr.com/console/calls/user/info

#### 3. Initialize tumblr-publish-md

```console
$ tumblr-publish-md --init
```

### Post

```console
$ tumblr-publish-md source/hello-world.md
```

## License

[Under The MIT License](https://isoden.mit-license.org/2017)
