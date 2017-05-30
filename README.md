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
$ tumblr-publish-md post source/hello-world.md
```

### Show List

```console
$ tumblr-publish-md ls
415869124166 2017-05-31 published Hello World!
```

output `post_id post_date post_status post_title`

### Update Post

- [ ] implemented

```console
$ tumblr-publish-md update source/hello-world.md --id 415869124166
```

### Delete Post

- [ ] implemented

```console
$ tumblr-publish-md delete --id 415869124166
```

## License

[Under The MIT License](https://isoden.mit-license.org/2017)
