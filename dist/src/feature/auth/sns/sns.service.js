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
exports.snsService = void 0;
exports.snsService = {
    google: () => __awaiter(void 0, void 0, void 0, function* () {
        let url = "https://accounts.google.com/o/oauth2/v2/auth";
        url += `?client_id=${process.env.GOOGLE_CLIENT_ID}`;
        url += `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI_LOGIN}`;
        url += "&response_type=code";
        url += "&scope=email profile";
        return url;
    }),
    kakao: () => __awaiter(void 0, void 0, void 0, function* () {
        let url = "https://kauth.kakao.com/oauth/authorize";
        url += `?client_id=${process.env.KAKAO_CLIENT_ID}`;
        url += `&redirect_uri=${process.env.KAKAO_REDIRECT_URI_LOGIN}`;
        url += "&response_type=code";
        return url;
    }),
    naver: () => __awaiter(void 0, void 0, void 0, function* () {
        let url = "https://nid.naver.com/oauth2.0/authorize?response_type=code";
        url += `&client_id=${process.env.NAVER_CLIENT_ID}`;
        url += `&redirect_uri=${process.env.NAVER_REDIRECT_URI_LOGIN}`;
        url += "&state=test";
        return url;
    })
};
