"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/14/2020
 * Description:
 ******************************************************************/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./body.decorator"), exports);
// export * from './cookie.decorator';
__exportStar(require("./ctx.decorator"), exports);
// export * from './exception.decorator';
// export * from './file.decorator';
__exportStar(require("./header.decorator"), exports);
__exportStar(require("./log.decorator"), exports);
// export * from './middleware.decorator';
// export * from './param.decorator';
__exportStar(require("./query.decorator"), exports);
// export * from './req.decorator';
// export * from './request.decorator';
__exportStar(require("./response.decorator"), exports);
__exportStar(require("./status.decorator"), exports);
