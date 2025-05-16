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
exports.fcmTokenService = void 0;
const IAM_dao_1 = require("../../../models/auth/IAM/IAM.dao");
exports.fcmTokenService = {
    fcmToken: (userId, body) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield IAM_dao_1.IAMDao.patchFcmToken(userId, body.token);
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    })
};
