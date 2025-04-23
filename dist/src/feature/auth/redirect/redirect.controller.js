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
const jwt_middleware_1 = require("../../../utils/jwt.middleware");
exports.redirectController = {
    naver: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // URL에서 code와 state를 추출
        const code = req.query.code; // 예: ?code=jFU1XfdIG9ffp9trs6
        const state = req.query.state; // 예: ?state=test
        yield jwt_middleware_1.tokenMinddleware.naver(req, res, () => { });
        console.log("res.locals", res.locals);
        // TODO: code를 이용하여 액세스 토큰 요청
        // 예시: 결과를 클라이언트에게 JSON으로 응답
        res.json({ code, state });
    })
};
