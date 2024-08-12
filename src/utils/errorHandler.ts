export class CustomError extends Error {
  constructor(public override message: string, public override name: string) {
    super(message);
    this.name = name;
  }
}
