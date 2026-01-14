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
exports.searchTagService = void 0;
const serchTag_dao_1 = require("../../models/searchTag/serchTag.dao");
const db_redis_1 = __importDefault(require("../../../config/db.redis"));
const response_status_1 = require("../../../config/response.status");
exports.searchTagService = {
    get: () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db_redis_1.default.get("searchTag");
        const res = Object.assign(Object.assign({}, response_status_1.status.SUCCESS.body), { result: result ? JSON.parse(result) : [] });
        return res;
    }),
    patch: () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield serchTag_dao_1.searchTagDao.patch(); // dao의 정보를 반환
        const searchTag = [];
        result.forEach((data) => {
            searchTag.push({
                teamId: data.teamId,
                leagueId: data.leagueId,
                tag: data.tag,
                itemName: data.itemName
            });
        });
        yield db_redis_1.default.set("searchTag", JSON.stringify(searchTag)); // redis에 저장
    })
};
