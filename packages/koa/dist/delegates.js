"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/delegates.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/03/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
class Delegates {
    constructor(proto, target) {
        this.proto = proto;
        this.target = target;
        this.#methods = [];
        this.#getters = [];
        this.#setters = [];
    }
    #methods;
    #getters;
    #setters;
    method(name) {
        const { target } = this;
        this.#methods.push(name);
        this.proto[name] = function () {
            return this[target][name].apply(this[target], arguments);
        };
        return this;
    }
    access(name) {
        const { target } = this;
        this.#getters.push(name);
        this.#setters.push(name);
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
        this.#getters.push(name);
        Object.defineProperty(this.proto, name, {
            get() {
                return this?.[target]?.[name];
            }
        });
        return this;
    }
    setter(name) {
        const { target } = this;
        this.#setters.push(name);
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
