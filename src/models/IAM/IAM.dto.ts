export interface postSignUpDto {
  userId: string;
  email: string;
  name: string;
  icon: string;
}

export interface headers {
  Authorization: string;
  RefreshToken: string;
}
