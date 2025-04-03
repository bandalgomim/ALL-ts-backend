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
exports.teamController = void 0;
const team_service_1 = require("./team.service");
exports.teamController = {
    get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const teamId = parseInt(req.query.teamId);
        const userId = res.locals.id;
        console.log("in team controller team Id: ", teamId);
        if (teamId) {
            const result = yield team_service_1.teamService.get(userId, teamId);
            res.json(result);
        }
    })
};
