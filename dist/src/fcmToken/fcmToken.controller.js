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
exports.fcmTokenController = void 0;
const fcmToken_service_1 = require("./fcmToken.service");
exports.fcmTokenController = {
    patch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = res.locals.id;
        const body = req.body;
        try {
            yield fcmToken_service_1.fcmTokenService.patch(userId, body);
            res.status(200).json(null);
        }
        catch (error) {
            res.status(500).json({ message: "Error updating FCM token", error });
        }
    })
};
