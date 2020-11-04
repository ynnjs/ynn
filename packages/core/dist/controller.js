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
    constructor(ctx, options = {}) {
        this.ctx = ctx;
        const { app } = ctx.app;
        this.app = app;
        this.logger = app.logger;
    }
    throw(...args) {
        return this.ctx.throw(...args);
    }
    async response(data, type, options = {}) {
        const { ctx } = this;
        ctx.body = data;
    }
    config() {
        return this.app.config(...arguments);
    }
    assert(value, ...args) {
        return http_assert_1.default(value, ...args);
    }
}
exports.default = Controller;
