export class OverflowException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UnderflowException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class IndexOutOfBoundsException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
