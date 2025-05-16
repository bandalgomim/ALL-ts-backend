"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.messaging = void 0;
const app_1 = require("firebase-admin/app");
const messaging_1 = require("firebase-admin/messaging");
const dotenv_1 = __importDefault(require("dotenv"));
// 환경 변수 로드
dotenv_1.default.config();
// 환경 변수에서 Firebase 서비스 계정 정보 가져오기
const serviceAccountData = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};
// Firebase Admin SDK 초기화
const app = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccountData),
});
// FCM Messaging 인스턴스 내보내기
exports.messaging = (0, messaging_1.getMessaging)(app);
