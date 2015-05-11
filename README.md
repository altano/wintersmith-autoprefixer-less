wintersmith-autoprefixer-less
==================

[Wintersmith](https://github.com/jnordberg/wintersmith) autoprefixing AND less compilation plugin

## Installing

Install globally or locally using npm

```
npm install [-g] wintersmith-autoprefixer-less
```

and add `wintersmith-autoprefixer-less` to your config.json in the plugins array

```json
{
  "plugins": [
    "wintersmith-autoprefixer-less"
  ]
}
```

and remove `wintersmith-less` from your config.json if you were using it previously.  Note that this replaces wintersmith-less completely. It will handle both less compilation and autoprefixing.

## Running tests

```
npm install
npm test
```
