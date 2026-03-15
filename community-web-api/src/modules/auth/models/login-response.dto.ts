export class LoginResponseDto {
  constructor(
    public accessToken: string,
    public refreshToken: string,
  ) {}
}
