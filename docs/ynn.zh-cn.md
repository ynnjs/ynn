# Ynn ['in]

Ynn是一个基于[Koa](https://koajs.com)开发的node服务器端框架，旨在更便捷的创建灵活且易维护的Web应用。

## 安装

```bash
$ npm install ynn --save
```

node.js >= 8.0.0

## 快速入门 

Ynn入手非常简单，只需要创建一个Ynn实例并监听某个端口。

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

在运行上面示例代码之前，你可能需要先安装`ynn-ms-idalloc`。`ynn-ms-idalloc`是一个用于生成SnowFlake ID的服务，可以帮助你理解Ynn的使用方法。

运行上面的代码之后，将会在控制台看到如下日志：

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

现在，通过 `http://127.0.0.1:3000` 便可以访问开启的服务。
在上面代码中，`ynn-ms-idalloc`被挂载，并且命名为`id`，所以可以直接通过`http://127.0.0.1:3000/id/flake` 来访问`ynn-ms=idalloc`提供的`/flake` API。

`ynn-ms-idalloc`的源码在[https://github.com/ynnjs/ynn-ms-idalloc](https://github.com/ynnjs/ynn-ms-idalloc)项目中。

Ynn是在Koa框架的基础上开发的，所有Koa的特性，比如中间件、路由等，在Ynn中都可以被直接使用，同时Ynn也提供了更多更方便的方法或规则来使用这些功能，在后面的内中会逐一介绍。


## 使用文档

### Ynn
