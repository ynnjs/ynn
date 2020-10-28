"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/load-files.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/28/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function loadFiles(dir) {
    const res = {};
    const subtasks = [];
    const files = await fs_1.default.readdir(dir);
    for (const name of files) {
        // skip ., .. and hidden files
        if (name.charAt(0) === '.')
            continue;
        const sub = path_1.default.join(dir, name);
    }
    return res;
}
exports.default = loadFiles;
