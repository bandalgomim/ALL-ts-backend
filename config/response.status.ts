import { StatusCodes } from "http-status-codes";
import { BaseApiResponse } from "./response";

export type ResponseType =
  | "SUCCESS"
  | "NOT_FOUND"
  | "EMAIL_ALREADY_EXIST"
  | "LOGIN_INFO_UNMATCHED"
  | "ACCESS_TOKEN_EXPIRED"
  | "REFRESH_TOKEN_UNMATCHED"
  | "ACCESS_TOKEN_IS_VALID"
  | "ACCESS_TOKEN_UNMATCHED"
  | "THERE_IS_NO_ACCESS_TOKEN"
  | "THERE_IS_NO_REFRESH_TOKEN"
  | "THERE_IS_NO_TOKEN"
  | "UNKNOWN_ERROR"
  | "POST_TYPE_EMPTY"
  | "WRONG_POST_ID"
  | "THERE_IS_NO_POSTID_OR_BODY"
  | "THERE_IS_NO_POSTID_OR_COMMENTID_OR_BODY"
  | "THERE_IS_NO_TITLE_OR_CONTENT_IN_POST"
  | "TEAM_TYPE_ERROR"
  | "WRONG_BODY"
  | "ONLY_AUTHOR_CAN_DELETE_OR_EDIT"
  | "UNAUTHORIZED"
  | "THERE_IS_NO_CONTENT_IN_COMMENT"
  | "REQUEST_BODY_INVALID"
  | "FORBIDDEN"
  | "GENERATING_PRESIGNED_URL_ERROR"
  | "JWT_SECRET_NOT_FOUND"
  | "JWT_VERIFICATIN_FAILED"
  | "REDIS_ERROR"
  | "DATA_SEARCH_SQL_ERROR"
  | "DATA_INSERTED_SQL_ERROR"
  | "DATA_UPDATED_SQL_ERROR"
  | "DATA_DELETED_SQL_ERROR"

export type ResponseWithStatus = {
  status: StatusCodes;
  body: Omit<BaseApiResponse<unknown>, "result">;
};

export const status: Record<ResponseType, ResponseWithStatus> = {
  SUCCESS: {
    status: StatusCodes.OK,
    body: { isSuccess: true, code: "200", message: "success!" },
  },
  NOT_FOUND: {
    status: StatusCodes.NOT_FOUND,
    body: { isSuccess: false, code: "404", message: "Not Found." },
  },
  EMAIL_ALREADY_EXIST: {
    status: StatusCodes.BAD_REQUEST,
    body: { isSuccess: false, code: "400", message: "email already exist." },
  },
  LOGIN_INFO_UNMATCHED: {
    status: StatusCodes.BAD_REQUEST,
    body: {
      isSuccess: false,
      code: "400",
      message: "login information unmatched.",
    },
  },
  ACCESS_TOKEN_EXPIRED: {
    status: StatusCodes.UNAUTHORIZED,
    body: { isSuccess: false, code: "401", message: "access token expired." },
  },
  REFRESH_TOKEN_UNMATCHED: {
    status: StatusCodes.UNAUTHORIZED,
    body: {
      isSuccess: false,
      code: "401",
      message: "refresh token unmatched.",
    },
  },
  ACCESS_TOKEN_IS_VALID: {
    status: StatusCodes.BAD_REQUEST,
    body: { isSuccess: false, code: "400", message: "access token is valid." },
  },
  ACCESS_TOKEN_UNMATCHED: {
    status: StatusCodes.UNAUTHORIZED,
    body: { isSuccess: false, code: "401", message: "access token unmatched." },
  },
  THERE_IS_NO_ACCESS_TOKEN: {
    status: StatusCodes.UNAUTHORIZED,
    body: {
      isSuccess: false,
      code: "401",
      message: "there is no access token.",
    },
  },
  THERE_IS_NO_REFRESH_TOKEN: {
    status: StatusCodes.UNAUTHORIZED,
    body: {
      isSuccess: false,
      code: "401",
      message: "there is no refresh token.",
    },
  },
  THERE_IS_NO_TOKEN: {
    status: StatusCodes.UNAUTHORIZED,
    body: { isSuccess: false, code: "401", message: "there is no token." },
  },
  UNKNOWN_ERROR: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    body: { isSuccess: false, code: "500", message: "서버 오류" },
  },
  POST_TYPE_EMPTY: {
    status: StatusCodes.BAD_REQUEST,
    body: { isSuccess: false, code: "400", message: "type이 비어있습니다." },
  },
  WRONG_POST_ID: {
    status: StatusCodes.BAD_REQUEST,
    body: { isSuccess: false, code: "400", message: "잘못된 post id 입니다." },
  },
  THERE_IS_NO_POSTID_OR_BODY: {
    status: StatusCodes.BAD_REQUEST,
    body: {
      isSuccess: false,
      code: "400",
      message: "postId와 body는 필수 입니다.",
    },
  },
  THERE_IS_NO_POSTID_OR_COMMENTID_OR_BODY: {
    status: StatusCodes.BAD_REQUEST,
    body: {
      isSuccess: false,
      code: "400",
      message: "postId와 commentId와 body는 필수 입니다.",
    },
  },
  THERE_IS_NO_TITLE_OR_CONTENT_IN_POST: {
    status: StatusCodes.BAD_REQUEST,
    body: {
      isSuccess: false,
      code: "400",
      message: "title과 content는 빈 값일 수 없습니다.",
    },
  },
  TEAM_TYPE_ERROR: {
    status: StatusCodes.BAD_REQUEST,
    body: {
      isSuccess: false,
      code: "400",
      message: "type은 team 또는 league 중 한 값이어야 합니다.",
    },
  },
  WRONG_BODY: {
    status: StatusCodes.BAD_REQUEST,
    body: {
      isSuccess: false,
      code: "400",
      message: "body를 확인해주세요.",
    },
  },
  ONLY_AUTHOR_CAN_DELETE_OR_EDIT: {
    status: StatusCodes.BAD_REQUEST,
    body: {
      isSuccess: false,
      code: "400",
      message: "작성자만 수정 혹은 삭제를 할 수 있습니다.",
    },
  },
  THERE_IS_NO_CONTENT_IN_COMMENT: {
    status: StatusCodes.BAD_REQUEST,
    body: {
      isSuccess: false,
      code: "400",
      message: "댓글 내용을 작성해주세요.",
    },
  },

  REQUEST_BODY_INVALID: {
    status: StatusCodes.BAD_REQUEST,
    body: {
      isSuccess: false,
      code: "400",
      message: "이 게시글을 삭제할 권한이 없습니다.",
    },
  },
  FORBIDDEN: {
    status: StatusCodes.FORBIDDEN,
    body: { isSuccess: false, code: "403", message: "접근이 금지되었습니다." },
  },
  GENERATING_PRESIGNED_URL_ERROR: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    body: {
      isSuccess: false,
      code: "400",
      message: "pre-signed URL generation error.",
    },
  },
  JWT_SECRET_NOT_FOUND: {
    status: StatusCodes.NOT_FOUND,
    body: {
      isSuccess: false,
      code: "400",
      message: "JWT secret is not defined in environment variables.",
    },
  },
  JWT_VERIFICATIN_FAILED: {
    status: StatusCodes.FORBIDDEN,
    body: {
      isSuccess: false,
      code: "400",
      message: "JWT verification failed.",
    },
  },
  REDIS_ERROR: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    body: {
      isSuccess: false,
      code: "400",
      message: "Redis error occurred.",
    },
  },
  DATA_SEARCH_SQL_ERROR: {
    status: StatusCodes.BAD_REQUEST,
    body: {
      isSuccess: false,
      code: "404",
      message: "there is an error in the SQL syntax for serching data.",
    },
  },
  DATA_INSERTED_SQL_ERROR: {
    status: StatusCodes.BAD_REQUEST,
    body: {
      isSuccess: false,
      code: "404",
      message: "there is an error in the SQL syntax for INSERTED data.",
    },
  },
  DATA_UPDATED_SQL_ERROR: {
    status: StatusCodes.BAD_REQUEST,
    body: {
      isSuccess: false,
      code: "404",
      message: "there is an error in the SQL syntax for UPDATED data.",
    },
  },
  DATA_DELETED_SQL_ERROR: {
    status: StatusCodes.BAD_REQUEST,
    body: {
      isSuccess: false,
      code: "404",
      message: "there is an error in the SQL syntax for DELETED data.",
    },
  },
  UNAUTHORIZED: {
    status: StatusCodes.BAD_REQUEST,
    body: { isSuccess: false, code: "404", message: "unauthorized" },
  },
};
