type SuccessResponse<T> = {
    isSuccess: true,
    code: string,
    message: string,
    result: T
};

type FailedResponse = {
    isSuccess: false,
    code: string,
    message: string
};

export type BaseApiResponse<T> = SuccessResponse<T> | FailedResponse;