"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionCheckService = void 0;
const response_status_1 = require("../../../config/response.status");
exports.versionCheckService = {
    post: (version) => __awaiter(void 0, void 0, void 0, function* () {
        let check;
        if (version.appVersion === "1.4" || version.appVersion === "1.4.1") {
            check = true;
        }
        else {
            check = false;
        }
        const res = Object.assign(Object.assign({}, response_status_1.status.SUCCESS.body), { result: check });
        return res;
    })
};
