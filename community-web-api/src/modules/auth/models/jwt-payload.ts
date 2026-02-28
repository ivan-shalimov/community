export class JwtPayload {
  constructor(
    public sub: string,
    public email: string,
    public name: string,
  ) {}
}
