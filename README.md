# Yolk

A simple framework uses to maintain services into separated sub modules based on Koajs. It is not exactly flexible, but it matches the requirements when you want to make your services more portable and maintainable.

## Start

To install the package with `npm`.

```js
$ npm i @lvchengbin/yolk --save
```
Then, you can use it in your code:
```js
const Yolk = require( '@lvchengbin/yolk' );

const app = new Yolk( { root : __dirname } );

app.listen( 3000 );
```

## Usage

### config

### router

### module

### controller

### service
