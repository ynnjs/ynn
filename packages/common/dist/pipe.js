"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/pipe.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/25/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPipesInSequence = exports.runPipe = void 0;
const is_1 = __importDefault(require("@lvchengbin/is"));
const core_1 = require("@ynn/core");
async function runPipe(pipe, value, ctx, metadata) {
    if (is_1.default.class(pipe)) {
        const instance = await core_1.createInjectableInstance(pipe, ctx);
        value = instance.transform(value, ctx, metadata);
    }
    else if (typeof pipe === 'function') {
        value = await pipe(value, ctx, metadata);
    }
    else {
        value = await pipe.transform(value, ctx, metadata);
    }
    return value;
}
exports.runPipe = runPipe;
async function runPipesInSequence(pipes, value, ctx, metadata) {
    for (const pipe of pipes) {
        value = await runPipe(pipe, value, ctx, metadata); // eslint-disable-line no-await-in-loop
    }
    return value;
}
exports.runPipesInSequence = runPipesInSequence;
