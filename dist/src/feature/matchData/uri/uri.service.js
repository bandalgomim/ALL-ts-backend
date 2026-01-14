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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uriService = void 0;
const db_redis_1 = __importDefault(require("../../../../config/db.redis"));
const matchData_1 = require("../../../utils/matchData");
exports.uriService = {
    post: (data, date) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const prevUriList = JSON.parse(yield db_redis_1.default.get(`prevUriList_${date}`));
        const mergedPrevUri = yield (0, matchData_1.mergePrevUri)(date);
        // 1. data와 mergedPrevUri 비교
        for (const platform in data) {
            for (const league in data[platform]) {
                // data와 mergedPrevUri에 모두 있는 값 삭제
                if ((_a = mergedPrevUri[platform]) === null || _a === void 0 ? void 0 : _a[league]) {
                    data[platform][league] = data[platform][league].filter((item) => !mergedPrevUri[platform][league].includes(item));
                }
                // data에만 있는 값 prevUriList에 추가
                if (!prevUriList[platform])
                    prevUriList[platform] = {};
                if (!prevUriList[platform][league])
                    prevUriList[platform][league] = [];
                for (const item of data[platform][league]) {
                    if (!prevUriList[platform][league].includes(item)) {
                        prevUriList[platform][league].push(item);
                    }
                }
            }
        }
        // prevUriList를 저장하거나 반환 등 필요한 작업 수행
        yield db_redis_1.default.set(`prevUriList_${date}`, JSON.stringify(prevUriList));
        return data;
    })
};
