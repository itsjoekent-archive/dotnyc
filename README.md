# dotnyc

my small corner of the internet.

## Setup

```sh
$ nvm use
$ npm install
$ npm start
```


```js
const pages = [
  '/work/all-in',
  '/work/arcadia',
  '/work/data-for-progress-2020',
  '/work/dosomething',
  '/work/fuller-project',
].reduce((acc, path) => ({
  ...acc,
  [path]: async () => import(`../../content${path}.toml`),
}), {});

export default async function loadContent(path) {
  if (pages[path]) {
    return await pages[path]();
  }
```