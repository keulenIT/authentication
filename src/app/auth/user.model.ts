export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    // if token is expired or doesn't exist, return null
    if (!!this._tokenExpirationDate || this._tokenExpirationDate < new Date()) {
      return null;
    }
  }
}
