"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/delegates.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/03/2020
 * Description:
 ******************************************************************/
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _methods, _getters, _setters;
Object.defineProperty(exports, "__esModule", { value: true });
class Delegates {
    constructor(proto, target) {
        this.proto = proto;
        this.target = target;
        _methods.set(this, []);
        _getters.set(this, []);
        _setters.set(this, []);
    }
    method(name) {
        const { target } = this;
        __classPrivateFieldGet(this, _methods).push(name);
        this.proto[name] = function () {
            return this[target][name].apply(this[target], arguments);
        };
        return this;
    }
    access(name) {
        const { target } = this;
        __classPrivateFieldGet(this, _getters).push(name);
        __classPrivateFieldGet(this, _setters).push(name);
        Object.defineProperty(this.proto, name, {
            get() {
                return this[target][name];
            },
            set(val) {
                return this[target][name] = val;
            }
        });
        return this;
    }
    getter(name) {
        const { target } = this;
        __classPrivateFieldGet(this, _getters).push(name);
        Object.defineProperty(this.proto, name, {
            get() {
                return this?.[target]?.[name];
            }
        });
        return this;
    }
    setter(name) {
        const { target } = this;
        __classPrivateFieldGet(this, _setters).push(name);
        Object.defineProperty(this.proto, name, {
            set(val) {
                return this[target][name] = val;
            }
        });
        return this;
    }
    methods(...names) {
        names.forEach((name) => { this.method(name); });
        return this;
    }
    accesses(...names) {
        names.forEach((name) => { this.access(name); });
        return this;
    }
    getters(...names) {
        names.forEach((name) => { this.getter(name); });
        return this;
    }
    setters(...names) {
        names.forEach((name) => { this.setter(name); });
        return this;
    }
}
exports.default = Delegates;
_methods = new WeakMap(), _getters = new WeakMap(), _setters = new WeakMap();
