"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/util.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/26/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.executePipes = exports.createGeneralDecorator = exports.createDecorator = exports.createParameterDecorator = exports.createExceptionDecorator = exports.createResponseDecorator = exports.createRequestDecorator = exports.saveParameterDecoratorMetadata = exports.saveExceptionDecoratorMetadata = exports.saveResponseDecoratorMetadata = exports.saveRequestDecoratorMetadata = void 0;
const method_interceptor_1 = require("@ynn/method-interceptor");
/**
 * Save metadata for request method decorator and class decorator
 *
 * @param constructorOrDescriptor - the constructor for class decorator or descriptor for method decorator
 * @param interceptor - interceptor function
 * @param parameters
 */
function saveRequestDecoratorMetadata(constructorOrDescriptor, // eslint-disable-line
interceptor, parameters) {
    if (typeof constructorOrDescriptor === 'function') {
        console.log('....');
    }
    else {
        method_interceptor_1.saveMetadataBefore(constructorOrDescriptor, interceptor, { parameters });
    }
}
exports.saveRequestDecoratorMetadata = saveRequestDecoratorMetadata;
/**
 * Save metadata for response method decorator and class decorator
 *
 * @example
 *
 * ```ts
 * ```
 *
 * @param constructorOrDescriptor - the constructor for class decorator or descriptor for method decorator
 * @param interceptor - interceptor function
 * @param parameters
 */
function saveResponseDecoratorMetadata(constructorOrDescriptor, // eslint-disable-line
interceptor, parameters) {
    if (typeof constructorOrDescriptor === 'function') {
        console.log('....');
    }
    else {
        method_interceptor_1.saveMetadataAfter(constructorOrDescriptor, interceptor, { parameters });
    }
}
exports.saveResponseDecoratorMetadata = saveResponseDecoratorMetadata;
function saveExceptionDecoratorMetadata(constructorOrDescriptor, // eslint-disable-line
interceptor, parameters) {
    if (typeof constructorOrDescriptor === 'function') {
        console.log('....');
    }
    else {
        method_interceptor_1.saveMetadataException(constructorOrDescriptor, interceptor, { parameters });
    }
}
exports.saveExceptionDecoratorMetadata = saveExceptionDecoratorMetadata;
function saveParameterDecoratorMetadata(target, // eslint-disable-line
key, index, interceptor, parameters) {
    method_interceptor_1.saveMetadataParameter(target, key, index, interceptor, { parameters });
}
exports.saveParameterDecoratorMetadata = saveParameterDecoratorMetadata;
function createRequestDecorator(interceptor, parameters) {
    return (targetOrConstructor, // eslint-disable-line @typescript-eslint/no-explicit-any
    key, descriptor) => {
        if (descriptor)
            saveRequestDecoratorMetadata(descriptor, interceptor, parameters);
    };
}
exports.createRequestDecorator = createRequestDecorator;
function createResponseDecorator(interceptor, parameters) {
    return (targetOrConstructor, // eslint-disable-line @typescript-eslint/no-explicit-any
    key, descriptor) => {
        if (descriptor)
            saveResponseDecoratorMetadata(descriptor, interceptor, parameters);
    };
}
exports.createResponseDecorator = createResponseDecorator;
function createExceptionDecorator(interceptor, parameters) {
    return (target, key, descriptor) => {
        if (descriptor) {
            saveExceptionDecoratorMetadata(descriptor, interceptor, parameters);
        }
    };
}
exports.createExceptionDecorator = createExceptionDecorator;
function createParameterDecorator(interceptor, parameters) {
    return (target, key, index) => {
        saveParameterDecoratorMetadata(target, key, index, interceptor, parameters);
    };
}
exports.createParameterDecorator = createParameterDecorator;
function createDecorator(options) {
    return (target, key, indexOrDescriptor) => {
        /**
         * Method decorators and parameter decorators have index/descriptor argument
         */
        if (indexOrDescriptor !== undefined) {
            if (typeof indexOrDescriptor === 'number') {
                options.parameterInterceptor && saveParameterDecoratorMetadata(target, key, indexOrDescriptor, options.parameterInterceptor, options.parameters);
                return;
            }
            if (options.requestInterceptor) {
                saveRequestDecoratorMetadata(indexOrDescriptor, options.requestInterceptor, options.parameters);
                return;
            }
            if (options.responseInterceptor) {
                saveResponseDecoratorMetadata(indexOrDescriptor, options.responseInterceptor, options.parameters);
                return;
            }
            if (options.exceptionInterceptor) {
                saveExceptionDecoratorMetadata(indexOrDescriptor, options.exceptionInterceptor, options.parameters);
                return;
            }
        }
    };
}
exports.createDecorator = createDecorator;
function createGeneralDecorator(options, propertyOrPipe, ...pipes) {
    const t1 = typeof propertyOrPipe;
    let property;
    /**
     * both property and pipe can be empty
     */
    if (t1 === 'string')
        property = propertyOrPipe;
    else if (t1 === 'function')
        pipes.unshift(propertyOrPipe);
    const parameters = { pipes };
    property && (parameters.property = property);
    return createDecorator({ ...options, parameters });
}
exports.createGeneralDecorator = createGeneralDecorator;
async function executePipes(pipes, value, ctx) {
    for (const pipe of pipes) {
        value = await pipe(value, ctx); // eslint-disable-line no-await-in-loop
    }
    return value;
}
exports.executePipes = executePipes;
