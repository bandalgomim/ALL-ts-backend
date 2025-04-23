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
exports.redirectController = void 0;
exports.redirectController = {
    naver: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // URL에서 code와 state를 추출
        res.json({
            code: req.query.code,
            state: req.query.state
        });
        // res.redirect(`com.ALLts:/oauthredirect?code=${req.query.code}&state=${req.query.state}`);
    })
};
