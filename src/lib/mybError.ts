class MyBError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MyBError";

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default MyBError;