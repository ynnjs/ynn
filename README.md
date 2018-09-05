# Ynn 

Ynn is a framework for building more flexible and portable web applications. It is based on [Koajs](https://koajs.com/) and more powerful.

Currently, `Ynn` is still in `Beta` version until the version `1.0.0` be published.

## Installation

```bash
$ npm install ynn --save
```

node.js >= 8.0.0 required.


## Getting Started

To create a `Ynn` instance and start to listen to a port:

```js
const Ynn = require( 'ynn' );
const app = new Ynn( {
    root : __dirname
} );

app.use( async ctx => {
    ctx.body = 'Hello Ynn'!;
} );

app.listen( 3000 );
```

The following information will output after executing the code above with `node` command, and you can visit from web browser with `http://127.0.0.1:3000`.

```bash
[Y] -----------------------------------------------------------------------
[Y] Application is ready.
[Y] Logs: /Users/ynn/workspace/ynn/examples/log
[Y] Modules: [  ].
[Y] Configs: [ log, rsc-local ].
[Y] Controllers: [  ].
[Y] Services: [  ].
[Y] Plugins: [  ].
[Y] Port: 54025 - http://127.0.0.1:3000.
[Y] Date: Tue Sep 04 2018 17:28:19 GMT+0800 (CST).
[Y] Time: 432ms.
[Y] Memory: 19.00MB.
[Y] -----------------------------------------------------------------------
```

Ynn is built base on `Koa`, therefore, features of `Koa`, such as middlewares, can also be used in Ynn application.

## Controller

It's very easy to create a controller by creating a directory named `controller` under the `root` directory of the application, and then, to create a file such as `index.js` in the `controller` directory with the code bellow.

```js
const Controller = require( 'ynn' ).Controller;

module.export = class extends Controller {
    indexAction() {
        return 'Hello Index Controller!'
    }
}
```

Then, visit the page from web browser with `http://127.0.0.1:3000`. The `index` controller is the default controller for every `Ynn` application, and the `indexAction` is the default action for every controller.

The directory of controllers can be changed in `config/app` [see more]() .

`Ynn` has created `router` rules for `controller` and `action` by default, therefore, you can simply access your service with path `/controller[/action]`.

```


## Service

## Boot

## Router

## Module

## Config

## Plugin

## RSC

## API Document
