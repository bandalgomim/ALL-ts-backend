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
exports.iconController = void 0;
const icon_service_1 = require("./icon.service");
exports.iconController = {
    patch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = res.locals.id;
        const type = req.body.type;
        const id = parseInt(req.body.id);
        const uri = req.body.uri;
        const result = yield icon_service_1.iconService.patchIcon(userId, type, id, uri);
        res.json(result);
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = res.locals.id;
        const type = req.body.type;
        const id = parseInt(req.body.id);
        const result = yield icon_service_1.iconService.deleteIcon(userId, type, id);
        res.json(result);
    })
};
