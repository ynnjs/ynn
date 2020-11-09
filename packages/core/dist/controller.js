"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/controller.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/16/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_assert_1 = __importDefault(require("@ynn/http-assert"));
class Controller {
    constructor(ctx) {
        this.ctx = ctx;
        this.assert = http_assert_1.default;
        const { app } = ctx;
        this.app = app;
        this.logger = app.logger;
        this.config = app.config.bind(app);
    }
    throw(...args) {
        return this.ctx.throw(...args);
    }
    config(...args) {
        return this.ctx.app.config(...args);
    }
    // provider( name: string ) {
    //     return this.ctx.app.providers[ name ];
    // }
    async response(data, type, options = {}) {
        const { ctx } = this;
        ctx.body = data;
    }
}
exports.default = Controller;
