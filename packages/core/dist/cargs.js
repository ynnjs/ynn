"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/args.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/07/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const is_1 = __importDefault(require("@lvchengbin/is"));
const cwd = process.cwd();
const cargs = yargs_1.default.argv;
if ('debugging' in cargs) {
    cargs.debugging = is_1.default.generalizedTrue(cargs.debugging);
}
if ('loggings' in cargs) {
    cargs.logging = is_1.default.generalizedTrue(cargs.logging);
}
if ('log-path' in cargs) {
    cargs['log-path'] = path_1.default.resolve(cwd, cargs['log-path']);
}
if ('root' in cargs) {
    cargs.root = path_1.default.resolve(cwd, cargs.root);
}
if ('config-dir' in cargs) {
    cargs['config-dir'] = path_1.default.resolve(cwd, cargs['config-dir']);
}
exports.default = cargs;
