import { ResponseWithStatus } from "./response.status"

export class ApiError extends Error {
    public readonly data: ResponseWithStatus;
    public constructor(data: ResponseWithStatus) {
        super(data.body.message);
        this.data = data;
    }
}