"use strict";
/**
 * 공통 타입 정의
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasApiError = hasApiError;
/**
 * API 응답에 에러가 있는지 확인
 */
function hasApiError(response) {
    if (!response.errors)
        return false;
    if (Array.isArray(response.errors))
        return response.errors.length > 0;
    return Object.keys(response.errors).length > 0;
}
