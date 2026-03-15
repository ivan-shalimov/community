export class UserData {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public sessionId?: string,
  ) {}
}
