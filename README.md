# Ynn ['in]

Ynn is a framework for building more flexible and portable web applications. It is based on [Koa](https://koajs.com/) but more powerful.

Currently, Ynn is still in `Alpha` version until the version `1.0.0` be published.


<!-- vim-markdown-toc GFM -->

* [Installation](#installation)
* [Getting Started](#getting-started)
* [Usage](#usage)
    * [Ynn](#ynn)
    * [Controller](#controller)
    * [Service](#service)
    * [Router](#router)
    * [Config](#config)
        * [Priority of configurations](#priority-of-configurations)
    * [Plugin](#plugin)
    * [Module](#module)
    * [View](#view)
    * [RSC](#rsc)
        * [Using `sham` request](#using-sham-request)
    * [Debugging](#debugging)
        * [Console](#console)
    * [Logging](#logging)
    * [Command Line Options](#command-line-options)
    * [Interactive Mode](#interactive-mode)

<!-- vim-markdown-toc -->

## Installation

```bash
$ npm install ynn --save
```

node.js >= 8.0.0 required.


## Getting Started

To create a Ynn instance and listening to a port:

```js
const Ynn = require( 'ynn' );
const app = new Ynn( {
    root : __dirname,
    debugging : true,
    logging : false,
    modules : {
        id : 'ynn-ms-idalloc'
    }
} );

app.use( async ctx => {
    ctx.body = 'Hello Ynn!';
} );

app.listen( 3000 );
```

Beforing running the sample code above, you may need to install the `ynn-ms-idalloc` package with `npm i ynn-ms-idalloc`. The package is an application bases on Ynn which provides an API for generating SnowFlake ID.

The following information will output after executing the code above with `node` command.

```bash
[Y] -----------------------------------------------------------------------
[Y] Application is ready.
[Y] Logs: /home/lvchengbin/workspace/ynn/ynn/example/log
[Y] Configs: [ app, log, rsc, view ].
[Y] Modules: [ id ].
[Y] Controllers: [  ].
[Y] Services: [  ].
[Y] Plugins: [  ].
[Y] Port: 3000 - http://127.0.0.1:3000.
[Y] Date: Mon Jan 07 2019 18:53:47 GMT+0800 (China Standard Time).
[Y] Time: 579ms.
[Y] Memory: 14.93MB.
[Y] -----------------------------------------------------------------------
```

Then you can visit from web browser with address `http://127.0.0.1:3000`.
Because the application has mounted a module `ynn-ms-idalloc` with name "id", so, the APIs that the `ynn-ms-idalloc` provides can be accessed without doing more things. Try to send request to `http://127.0.0.1:3000/id/flake` then you will get an ID generated by SnowFlake algorithm.

The Github address of the repository `ynn-ms-idalloc` package is [https://github.com/ynnjs/ynn-ms-idalloc](https://github.com/ynnjs/ynn-ms-idalloc)

Ynn is built base on Koa, therefore, features of Koa, such as middlewares, can also be used in Ynn application.

## Usage

### Ynn

Class Ynn extends from the `Application` class of `Koa`. Like the sample code above, it is very easy to create a application with `new Ynn( options )`. While initializing a Ynn application, the following steps will be processed:

 - Using RSC middleware if the application is not mounted as a module.
 - Parsing the request body if the application is not mounted as a module.
 - Init the config files.
 - Init the logger.
 - Init the access logger.
 - Init(in parallel) :
    - controllers,
    - modules
    - routing rules 
    - service files
    - view
 - Register routing rules for static files, modules and controllers (and actions).
 - Init plugins.

There is a `option` object can be passed to the constructor of Ynn, all properties of the `option` object will be bound to the instance of the application. The `option` object can include the following items for configure the application:

**root** `String`

Denoting the root path of the application. It should always be set even though there are rules for getting default value of root if is not passed in options object:
 - If the application is mounted as a module of another application, the root path will be set same as the mounting path as default.
 - If the application is not mounted by other applications, the default root path will be the directory path of [require.main](https://nodejs.org/dist/latest-v8.x/docs/api/modules.html#modules_accessing_the_main_module) file in node.js.


**debugging** `Boolean` | `Integer`

Denoting the permissible [Console]() logs of the application, which can also be specified with [Command Line Options](). If it isn't specified, the `debugging` level will inherit from the parent application if the application is mounted as a module by other applications, and if the application is not mounted as a module, the `debugging` level will be set to `Ynn.DEBUGGING_DEFAULT`. 

[See more of Ynn.Console]().

```js
new Ynn( {
    root : __dirname,
    debugging : Ynn.DEBUGGING_LOG ^ Ynn.DEBUGGING_WARN // or just to use true or false to open or close all console logs.
} );
```

**logDir** `String`

To specify the path of the directory for storing log files. This option will be ignored if the application is mounted by another one, alternatively, the `logDir` of the parent application will be used, a directory named same as the module name will be created in the `logDir`. If the application isn't mounted by others, the default directory for storing log files is `{root}/log`.

**logging** `Boolean`

To disable printing logs. Sometimes, we don't want web framework to print logs, for example if we just create a simple web server for testing, likewise, we may want to prevent some modules from printing logs. Specifying `logging` option will stop the application to print logs (or write logs to files).

The `logging` option has two acceptable value:

 - `Ynn.LOGGING_DISABLE` for disable logs of current application.
 - `Ynn.LOGGING_DISABLE_ALL` for disable logs of current application and all descendant applications.

```js
new Ynn( {
    root : __dirname,
    logging : Ynn.LOGGING_DISABLE_ALL
} );
```

**configDir** `String`

Specifying the path of config directory, the default value is `{root}/config`. There are some rules, for config files for priority and initialization, which can be found at the [Config]() part.

**logger** 

To specify another logger for insteading of using the default logger of Ynn. By default, Ynn uses [winston](https://github.com/winstonjs/winston) for logging. Make sure that, the logger object at least has `info` and `error` methods.

**routers** `Function`

To adding routing rules for the application. It also can be set in a separated `routers.js` file. For more information of `routing`, please view [Router]().

```js
new Ynn( {
    root : __dirname,
    routers() {
        this.router.get( '/', ctx => {
            ctx.body = 'Hi Ynn!';
        } );
    }
} );
```

**static** `Object`

Specifying rules for static files. The `static` option should be an Object with one or more k=>v pairs, each key should be the `routing rule` and value should be the path of the directory of static files. Be wared of that the path will be resolved with the root path of the application if it isn't a absolute path.

```js
new Ynn( {
    root : __dirname,
    static : {
        '/static/(.*)' : '.',
        '/another-static-rule/(.*)' : '.'
    }
} );
```

**modules** `Object`

To config applications which will be mounted as modules for the application, for example:

```js
new Ynn( {
    root : __dirname,
    modules : {
        name1 : 'path/to/module1',
        name2 : '/path/to/module2',
        name3 : {
            path : 'path/to/module3',
            config :  {
            }
        },
        name4 : {
            path : 'path/to/module4',
            configDir : 'path/to/configdir/for/module4'
        }
    }
} );
```

The path of each module should be an absolute path or relative to the root path of current application, you even can specify a module which can be found in `node_modules` directory by setting a path which is not start with `.` or `/`, so that, a module that installed with `npm` can be mounted directly.

The `configDir` property can be used to specify a directory, so that, it is easy to ask a sub module to use the same configuration files with current module, but some filles will be ignored, including `modules.js`, `plugins.js`, `app.js`, `rsc.js`, `log.js`.

The configuration for mounting modules can also be maintained in a `modules.js` in config directory or both these two places.

One module can be mounted multiple times with different names.

To read the [Module]() part for more about Ynn modules.

**plugins**

To configure plugins which will be loaded to current application, this config can also be maintained in a `plugins.js` in config directory.

```js
new Ynn( {
    plugins : {
        redis : {
            // this plugin will be loaded from node_modules
            path : 'redis', 
            options : {
                // options which will be pass to the plugin
            }
        },
        // this plugin will be loaded from root/plugin/mysql.js
        mysql : './plugin/mysql.js', 
    }
} );
```

### Controller

It's very easy to create a controller by creating a directory named `controller` under the `root` directory of the application, and then, to create a file such as `index.js` in the `controller` directory with the code bellow.

```js
const Controller = require( 'ynn' ).Controller;

module.exports = class extends Controller {
    indexAction() {
        return '<h1>Hello Index Controller!</h1>'
    }
}
```

Then, visit the page from web browser with `http://127.0.0.1:3000`, you will get "Hello Index Controller!". 

The directory for controllers can be changed in `config/app` [see more]() .

Ynn creates routing rules for `controller` and `action` by default, therefore, you can simply access your service with path `/controller/action`, and the path `/` will be matched to `/index/index'

### Service

An Ynn Service layer is used for encapsulating logics which are complicated or need to be used cross controllers. Service files will be loaded while initializing the Ynn application, and will be initialized while getting the Service with [app.service]() method. Beware of that every time of getting a Service with `app.service` method, a new instance will be created if the Service file exports a class.

A Service script file shoule exports a `Function` or a `Class` extends from `Ynn.Service` or not. For example:

```js
module.exports = app => {
    // this fucntion will be executed every time while getting this service with Runtime.service.
};
```

```js
// article.js
module.exports = class extends require( 'ynn' ).Service {
    constructor( app, options = {} ) {
        super( app, options );
    }

    getById( id ) {
        // get data by id
    }
}
```

### Router

Ynn defines some routing rules by default:

 - routing rules for Controllers and Actions: `/:controller/:action`, `/:controller`, `/`
 - routing rules for mounted Modules: `/module/(.*)`
 - routing rules for static files if specified ([See more]()).

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

To define a rule that point to a specified controller (and action), the callback function should return an Object or a String, or even the second parameter can be a String. For example:

```js
app.router.add( '/another/rule', ctx => {
    return {
        controller : 'the-controller-name',
        action : 'the-action-name'
    }
} );

app.router.add( '/another/rule2', ctx => 'controller.action' );

app.router.add( '/another/rule3', 'controller.action' );
```

To define a rule that point to a Module, the callback function should return an Object that has a property "module" with it's value is the name of the target module.

The returned Object also can have a property named "path", the value of the "path" perpoty will overwrite the `ctx.path`, so that the routing rules of the target module doesn't need to care about the real request path. For example:

```js
app.router.mount( '/another-module', ctx => {
    return {
        module : 'the module name.',
        path : '/'
    };
} );
```

Ynn uses [lvchengbin/koa-router](https://github.com/LvChengbin/koa-router) in the project, you can get more information about routing rules from that repositry.

### Config

Ynn application instance looks for config files in `{root}/config` directory during initialization. For example, to create a `mysql.js` in config directory for connecting mysql database:

```js
module.exports = {
    host : '127.0.0.1',
    username : 'ynn',
    password : '',
    port : 3306,
    database : 'ynn',
};
```

If a config file exports a function instead of a literal object, the function will be executed while loading by passing an argument which is the Ynn application instance:

```js
module.exports = app => {
    mysql : app.config( 'mysql' )
};
```

#### Priority of configurations
Ynn applications load config info from the following ways, ordered by the priority:

 - Config items that passed while mounting the application if the application is mounted as a Ynn module, for example:
    ```js
    new Ynn( {
        root : __dirname,
        modules : {
            id : {
                path : 'ynn-ms-idalloc',
                config : {
                    worker : 2
                }
            }
        }
    } );
    ```
 - Config files in the `configDir` that specified while mounting the application, for example:
    ```js
    new Ynn( {
        root : __dirname,
        modules : {
            id : {
                path : 'ynn-ms-idalloc',
                configDir : './config'
            }
        }
    } );
    ```
 - Config files in config directories of applications
 - Config files in config directories of Ynn project as default configurations: [https://github.com/ynnjs/ynn/tree/master/lib/config](https://github.com/ynnjs/ynn/tree/master/lib/config).

To sum up the list above, we can know how to overwrite the original config files while mounting it, and by exporting a function in `config/modules.js` you can get config items from current application. For example, in`config/modules.js`:

```js
module.exports = app => {
    return {
        id : {
            path : 'ynn-ms-idalloc',
            config : {
                // get config item "worker" from configuration of current applciation
                worker : app.config( 'worker' )
            }
        }
    }
};
```

#### Configurations for Ynn applications



### Plugin

A Plugin in Ynn is just a file which will be loaded while creating an application, and following some simple rules:

 - If the plugin file exports a class, the class will be initialized with `new` operator automatically, and two arguments, instance of the app and options for the plugin, will be passed to the constructor. For example:
 - If the plugin file exports a function, then the function will be executed automatically with two arguments, instance of the app and options for the plugin. 
 - If the plugin file exports with other data type, the data will be bound to current app instance with it's property name as the plugin name.


A simple example: [`ynn-plugin-redis`](https://github.com/ynnjs/ynn-plugin-redis/blob/master/src/index.js).

### Module

If a Ynn app instance is mounted by other Ynn apps, it becomes a Ynn module. So, a Ynn application is able to be used to start a service or mount to other service. For example, if there is an app named "A":

```js
new Ynn( {
    root : __dirname,
    router() {
        this.get( '/home', ctx => {
            ctx.body = 'this is the home of module A';
        } );
    }
} );
```

And a module "B" mounts the moudule A:

```js
const app = new Ynn( {
    root : __dirname,
    modules : {
        a : 'the/path/to/module/a'
    }
} );

app.listen( 3000 );
```

With the code above, if we start a server from module "B", and then send a request to `http://127.0.0.1:3000/a/home`, we will get `this is the home of module A` in response. Certainly, a module can be mounted multiple times with different mounting name, and even with different configuration:

```js
const app = new Ynn( {
    root : __dirname,
    modules : {
        a : 'the/path/to/module/a',
        'another-a' : {
            path : 'the/path/to/module/a',
            config : {
                mysql : {}
            }
        }
    }
} );

app.listen( 3000 );
```

For this example, both `http://127.0.0.1:3000/a/home` and `http://127.0.0.1:3000/another-a/home` will respond the same result.

For the code above, we can also move the `modules` part into `config/modules.js` file, for example:

```js
// config/modules.js
module.exports = {
    a : 'the/path/to/module/a',
    'another-a' : {
        path : 'the/path/to/module/a',
        config : {
            mysql : {}
        }
    }
}
```

Generally, the submodule doesn't need to know if it is mounted by other modules or not, you don't need to change any line of code for it. But if you really need to get some mounting information, Ynn provides some properties and methods for that:

 **find( path )**

 ```js
 const app = new Ynn( {
    root : __dirname,
    modules : {
        a : 'path/to/a',
        b : 'path/to/b'
    }
 } );

 console.log( app.find( 'a' ) );

// if module a has a submodule named x
console.log( app.find( 'a.x' ) );
 ```
### View

### RSC

#### Using `sham` request

### Debugging

#### Console

Ynn has several debugging levels that can be set with the builtin constants:

 - `Ynn.DEBUGGING_NONE` or `false` means disable all logs in console.
 - `Ynn.DEBUGGING_SPEC` means allowing `console.spec`.

### Logging

### Command Line Options

### Interactive Mode
