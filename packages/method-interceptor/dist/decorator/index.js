"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDecoratorAfter = exports.createDecoratorBefore = void 0;
const create_decorator_before_1 = __importDefault(require("./create-decorator-before"));
exports.createDecoratorBefore = create_decorator_before_1.default;
const create_decorator_after_1 = __importDefault(require("./create-decorator-after"));
exports.createDecoratorAfter = create_decorator_after_1.default;
__exportStar(require("./create-decorator-before"), exports);
__exportStar(require("./create-decorator-after"), exports);
