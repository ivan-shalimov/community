export class LoginResponseDto {
  constructor(
    public access_token: string,
    public refresh_token: string,
    public token_type: 'Bearer' = 'Bearer',
    public expires_in: number = 3600,
  ) {}
}
