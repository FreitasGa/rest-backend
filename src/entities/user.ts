export class User {
  id: string;
  email: string;
  password: string;
  name: string;
  confirmed: boolean;
  secret: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  blockedTill: Date | null;

  constructor(input: User) {
    this.id = input.id;
    this.email = input.email;
    this.password = input.password;
    this.name = input.name;
    this.confirmed = input.confirmed;
    this.secret = input.secret;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.deletedAt = input.deletedAt;
    this.blockedTill = input.blockedTill;
  }
}
