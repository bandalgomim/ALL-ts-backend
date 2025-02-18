export interface postSignUpDto {
    userId: string,
    email: string,
    name: string,
    iconUrl: string
}

export interface headers {
    Authorization: string,
    RefreshToken: string
}
