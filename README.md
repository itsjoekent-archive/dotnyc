# dotnyc

My small corner of the internet.

## Setup

Setup [Node Version Manager](https://github.com/nvm-sh/nvm) if you haven't already.

```sh
$ nvm use
$ npm ci
$ npm start
```

**NOTE**: In order to run the production build command, you'll need to setup environment variables,

```sh
$ cp .env.example .env
$ npm run build
```

## Development Goals

1. **Write HTML templates, CSS files, and JavaScript that uses native dom API's.**

This website is tiny. It needs to render a landing page, and a few content pages that don't really have a home anywhere else. It's a tiny website, there's no advanced rendering happening here, and I don't need React, or NextJS, tachyons, or any other large frontend framework.

2. **Store my content in the repo, media assets in S3 compatible storage.**

Storing text files in my repository that contain all of my content is simple. I don't want to sign up for a CMS product, or integrate a large open source CMS, when I can simply parse key/values from a file and fulfill my needs.

Storing videos in Git repositories isn't ideal, so I also want this system to support external media storage. "Object storage" products are incredibly cheap and exist across cloud providers with common API's.

3. **Deploy static files to a CDN.**

This website is tiny, it has no dynamic content. It does not need serverless functions or a constantly running Node express server. Everything can be pregenerated at build time.

_Why not use a newer trendier build tool, such as [Vite](https://vitejs.dev/), instead of [Webpack](https://webpack.js.org/?_

[Have you read all of the steps involved to get server side rendering working????](https://vitejs.dev/guide/ssr.html). This is a tiny website. It does not need all of this complication.

## How It Works

1. Parses [TOML](https://toml.io) files in the `/content` directory.
2. Reads HTML templates in the `/templates` directory.
3. Matches the content to the template, renders the template with [mustache](http://mustache.github.io/mustache.5.html).

For production deploys, it does this process for every file in the `content` folder and outputs the result to nested `index.html` files in the build folder. It then downloads all of the media assets from [Cloudflare R2](https://www.cloudflare.com/products/r2/) into the output folder. The output folder is then deployed to Cloudflare's CDN.

## Mustache Template Functions

**Markdown**

Convert the [Markdown](https://daringfireball.net/projects/markdown/syntax) string into HTML.

```mustache
{{#markdown}}# hello{{/markdown}}
{{#markdown}}{{textVariable}}{{/markdown}}
```

**Media**

Replace the `src` for an asset with either a relative url (production) or a remote url (development).

```mustache
{{#media}}example.png{{/media}}
{{#media}}{{exampleAssetSrc}}{{/media}}
```
