# Ynn 

A simple framework uses to maintain services into separated sub modules based on Koajs. It is not exactly flexible, but it matches the requirements when you want to make your services more portable and maintainable.

## Start

To install the package with `npm`.

```js
$ npm i ynn --save
```
Then, you can use it in your code:
```js
const Ynn = require( '@lvchengbin/ynn' );

const app = new Ynn( { root : __dirname } );

app.listen( 3000 );
```
