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

### Post

```console
$ tumblr-publish-md post --file source/hello-world.md
```

### Show Published Posts

```console
$ tumblr-publish-md ls-remote
415869124166 2017-05-31 Hello World! Ep.3
340829163716 2017-05-30 Hello World! Ep.2
256314326581 2017-05-29 Hello World! Ep.1
```

output `post_id post_date post_title`

### Update Post

```console
$ tumblr-publish-md update --file source/hello-world.md --id 415869124166
```

### Delete Post

- [ ] implemented

```console
$ tumblr-publish-md delete --id 415869124166
```

## License

[Under The MIT License](https://isoden.mit-license.org/2017)
