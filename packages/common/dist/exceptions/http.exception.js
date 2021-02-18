"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: exceptions/http.exception.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/18/2021
 * Description:
 ******************************************************************/
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _status, _message, _response;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
const statuses_1 = __importDefault(require("statuses"));
class HttpException extends Error {
    constructor(status, message) {
        super();
        _status.set(this, 500);
        _message.set(this, statuses_1.default.message[500] ?? '');
        _response.set(this, void 0);
        if (typeof status === 'string') {
            this.message = status;
        }
        else if (typeof status === 'number') {
            this.status = status;
            message && (this.message = message);
        }
        else {
            const response = { ...status };
            if (!response.error) {
                response.error = statuses_1.default.message[response.status] ?? '';
            }
            if (!response.message)
                response.message = '';
            this.response = response;
        }
    }
    set status(status) {
        __classPrivateFieldSet(this, _status, status);
        this.message = statuses_1.default.message[status] ?? '';
    }
    get status() {
        return __classPrivateFieldGet(this, _status);
    }
    set message(message) {
        __classPrivateFieldSet(this, _message, message);
    }
    get message() {
        return __classPrivateFieldGet(this, _message);
    }
    get response() {
        return __classPrivateFieldGet(this, _response);
    }
    set response(response) {
        __classPrivateFieldSet(this, _response, response);
        if (response) {
            this.status = response.status;
            this.message = response.error;
        }
    }
}
exports.HttpException = HttpException;
_status = new WeakMap(), _message = new WeakMap(), _response = new WeakMap();
