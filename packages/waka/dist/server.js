"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/server.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/16/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
class Controller {
    constructor(ctx) {
        this.ctx = ctx;
    }
    profileAction() {
        return {
            status: 0,
            id: this.ctx.query.id
        };
    }
}
const app = new _1.default({
    controllers: {
        user: Controller
    }
});
app.listen(3000);
