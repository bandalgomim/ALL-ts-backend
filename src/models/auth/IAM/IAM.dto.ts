export interface postSignUpDto {
    userId: string,
    email: string,
    nickname: string,
    icon: string
}

export interface headers {
    Authorization: string,
    RefreshToken: string
}
