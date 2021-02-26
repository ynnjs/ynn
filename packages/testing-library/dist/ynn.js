"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/02/2020
 * Description:
 ******************************************************************/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppWithRequest = exports.createApp = exports.createContext = void 0;
const core_1 = __importStar(require("@ynn/core"));
function createContext(request, response) {
    return new core_1.Context({
        app: new core_1.default(),
        request: {
            url: '/',
            method: 'GET',
            ...request
        },
        response: { ...response }
    });
}
exports.createContext = createContext;
function createApp(options) {
    return new core_1.default(options);
}
exports.createApp = createApp;
;
async function createAppWithRequest(options, context) {
    const app = options instanceof core_1.default ? options : createApp(options);
    return app.handle(context);
}
exports.createAppWithRequest = createAppWithRequest;
