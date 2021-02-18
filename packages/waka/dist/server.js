"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/server.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/16/2021
 * Description:
 ******************************************************************/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@ynn/common");
const _1 = __importStar(require("."));
let CatService = class CatService {
    constructor(ctx) {
        console.log(ctx);
    }
};
CatService = __decorate([
    __param(0, common_1.Ctx()),
    __metadata("design:paramtypes", [_1.Context])
], CatService);
let Controller = class Controller {
    constructor(ctx) {
        this.ctx = ctx;
    }
    index(log, catService, id) {
        console.log(this.ctx);
        console.log('catService: ', catService);
        if (!id)
            throw new common_1.HttpException(401);
        return { status: 0, id };
    }
};
__decorate([
    _1.Action('profile'),
    __param(0, common_1.Log()), __param(2, common_1.Query('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CatService, Number]),
    __metadata("design:returntype", Object)
], Controller.prototype, "index", null);
Controller = __decorate([
    __param(0, common_1.Ctx()),
    __metadata("design:paramtypes", [_1.Context])
], Controller);
const app = new _1.default({
    controllers: {
        user: Controller
    }
});
app.listen(3001);
