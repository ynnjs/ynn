# Ynn ['in]

Ynn is a framework for building more flexible and portable web applications. It is based on [Koa](https://koajs.com/) but more powerful.

Currently, Ynn is still in `Alpha` version until the version `1.0.0` be published.

## Installation

```bash
$ npm install ynn --save
```

node.js >= 8.0.0 required.


## Getting Started

To create a Ynn instance and start to listen to a port:

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
[Y] Boot File: null
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

Ynn is built base on Koa, therefore, features of Koa, such as middlewares, can also be used in Ynn application.

## Usage

### Controller

It's very easy to create a controller by creating a directory named `controller` under the `root` directory of the application, and then, to create a file such as `index.js` in the `controller` directory with the code bellow.

```js
const Controller = require( 'ynn' ).Controller;

module.exports = class extends Controller {
    indexAction() {
        return 'Hello Index Controller!'
    }
}
```

Then, visit the page from web browser with `http://127.0.0.1:3000`, you will get "Hello Index Controller!". 

The directory for controllers can be changed in `config/app` [see more]() .

Ynn creates routing rules for `controller` and `action` by default, therefore, you can simply access your service with path `/controller/action`, and the path `/` will be matched to `/index/index'

### Boot

Except the `index.js`( app creation file ), you can also have a `boot.js` file in the `root` directory. If the `boot.js` exists, it will be loaded while starting the process and be executed per request before excuting `controller` and `action`. It's used for running some common processes at the beginning of every request.

The `boot.js` shoule export a `Function` or a `Class` which can extend from `Ynn.Boot` or not. For example:

```js
module.exports = ctx => {
    ctx.app.logger.info( 'booting' );
};
```
If the `boot.js` exports a `Class` extends from `Ynn.Boot`, it will be more convenient to use methods of `Ynn.Runtime`. For example:

```js
module.exports = class extends require( 'Ynn' ).Boot {
    constructor( ctx ) {
        super( ctx );
        this.logger.info( 'booting' );
    }

    async _initAccountValidate() {
        try {
            this.ctx.state.account = await this.service( 'account' ).info();
        } catch( e ) {
            this.throw( 403 );
        }
    }
}
```

### Service

An Ynn Service layer is used for encapsulating logics which are complicated or need to be used cross controllers. Service files will be loaded while initializing the Ynn application, and will be initialized while getting the Service with [Runtime.service]() method. Beware of that every time of getting a Service with `Runtime.service` method, will create a new instance of the Service class if the Service file exports a class.

A Service script file shoule exprots a `Function` or a `Class` extends from `Ynn.Service` or not. For example:

```js
module.exports = ctx => {
    // this fucntion will be executed every time while getting this service with Runtime.service.
};
```

```js
// article.js
module.exports = class extends require( 'ynn' ).Service {
    construct( ctx ) {
        super( ctx );
    }

    getById() {
    }
}
```

The Services can be used in `Ynn.Boot`, `Ynn.Controller`, `Ynn.Service` and all other classes extend from `Ynn.Runtime`. For example:

```js
module.exports = class extends require( 'ynn' ).Controller {
    indexAction() {
        return this.service( 'article' ).getById( id );
    }
}
```

### Router

Ynn defines some routing rules by default:

 - routing rules for Controllers and Actions: `/:controller/:action`, `/:controller`, `/`
 - routing rules for mounted Modules: `/module/(.*)`
 - routing rules for static files if specified.

Therefore, in most cases, it doesn't need to set custom routing rules, but it's still possible. Except the way that provides by Koa, there are another two standard ways to define routing rules in Ynn:
 - Define the routing rules in `{root}/routers.js`.
 - Define the routing rules in `routers` method.

For example, in `routers.js`:

```js
module.exports = app => {
    app.router.get( '/', ctx => {
        ctx.body = 'custom rule';
    } );
};
```

In `routers` method:

```js
new Ynn( {
    routers() {
        this.router.get( '/', ctx => {
            ctx.body = 'custom rule';
        } );
    }
} );
```

To define a rule point to a specified controller (and action), the callback function should return an `Object` or a `String`. For example:

```js
app.router.add( '/another/rule', ctx => {
    return {
        controller : 'the-controller-name',
        action : 'the-action-name'
    }
} );

app.router.add( '/another/rule2', ctx => 'controller.action' );
```

To define a rule that point to a Module:

```js
app.router.mount( '/another-module', ctx => {
    return {
        module : 'the module name.',
        path : 'the new path which will override the ctx.path for the destination module.'
    };
} );
```

### Config

Ynn instance looks for config files in `{root}/config` directory while initializing the Ynn instance. For example, to create a `mysql.js` in config directory for connecting mysql database:

```js
module.exports = {
    host : '127.0.0.1',
    username : 'ynn',
    password : '',
    port : 3306,
    database : 'ynn',
};
```

The config items can be get in `Ynn.Controller`, `Ynn.Service`, `Ynn`, `Ynn.Boot` and all other classes extends from `Ynn.Runtime`. For example:

```js
module.exports = class extends require( 'ynn' ).Controller {
    indexAction() {
        const dbname = this.config( 'mysql.database' );
    }
}
```

If a config file exports a `Function` instead, the function will be executed while loading by passing an argument which is the Ynn application instance:

```js
module.exports = app => {
    mysql : app.config( 'mysql' )
};
```

### Plugin

### Module

A Module in Ynn is a special concept. If an Ynn instance is mounted by other Ynn instances, it becomes a Module. 

### RSC

### Debugging

### Logging

### Interactive Mode
