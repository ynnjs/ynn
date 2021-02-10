"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/action.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/02/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = exports.Action = void 0;
const constants_1 = require("./constants");
/**
 * generate the `@Action` decorator which is used to mark a instance method to be an `Action`.
 *
 * @param name - the `Action`'s name, using the method name by default.
 *
 * @return a method decorator
 */
function Action(name) {
    return (target, key, descriptor) => {
        const metadata = Reflect.getMetadata(constants_1.ACTION_METADATA_KEY, descriptor.value) || [];
        metadata.push(name ?? key);
        Reflect.defineMetadata(constants_1.ACTION_METADATA_KEY, metadata, descriptor.value);
    };
}
exports.Action = Action;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const ACTION_METHOD_SUFFIX_LENGTH = constants_1.ACTION_METHOD_SUFFIX.length;
function scan(obj // eslint-disable-line
) {
    const actions = {};
    const hasOwn = hasOwnProperty.bind(actions);
    const overwritten = new Set();
    let proto = obj; // eslint-disable-line
    /**
     * to scan action methods from current object hierarchically.
     */
    while (proto) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition
        Reflect.ownKeys(proto).forEach((key) => {
            if (hasOwn(key) || overwritten.has(key))
                return;
            /**
             * An action must be a function
             * the property will overwrite the one has same name in prorotype chain.
             */
            if (typeof proto?.[key] !== 'function') {
                overwritten.add(key);
                return;
            }
            const descriptor = Reflect.getOwnPropertyDescriptor(proto, key);
            if (!descriptor)
                return;
            /**
             * scan all actions are exposed by @Action() decorator
             */
            Reflect.getMetadata(constants_1.ACTION_METADATA_KEY, descriptor.value)?.forEach((name) => {
                actions[name] = {
                    proto: proto,
                    methodName: key,
                    descriptor
                };
            });
            /**
             * scan all methods whose name end withs 'Action'
             */
            if (typeof key === 'string' && key.endsWith(constants_1.ACTION_METHOD_SUFFIX)) {
                const name = key.substr(0, key.length - ACTION_METHOD_SUFFIX_LENGTH);
                /**
                 * the action method that exposed with @Action() decorator has high precedence.
                 * indexAction should not override @Action( 'index' )
                 */
                if (hasOwn(name))
                    return;
                actions[name] = { methodName: key, descriptor, proto };
            }
        });
        proto = Reflect.getPrototypeOf(proto);
    }
    return actions;
}
exports.scan = scan;
