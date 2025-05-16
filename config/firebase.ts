import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { ServiceAccount } from 'firebase-admin/app';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

// 환경 변수에서 Firebase 서비스 계정 정보 가져오기
const serviceAccountData: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID as string,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') as string,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
};

// Firebase Admin SDK 초기화
const app = initializeApp({
  credential: cert(serviceAccountData),
});

// FCM Messaging 인스턴스 내보내기
export const messaging = getMessaging(app);
