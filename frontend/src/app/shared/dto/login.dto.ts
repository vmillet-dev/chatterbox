export class LoginDto {
  constructor(public readonly usernameOrEmail: string, public readonly password: string) {}
}
