import { expect } from 'chai';
import { toJSON } from '../../src';

describe('toJSON', () => {
  it('should serialize null', () => {
    expect(toJSON(null)).equals('null');
  });

  it('should serialize undefined', () => {
    expect(toJSON(undefined)).to.be.undefined;
  });

  it('should serialize a string', () => {
    expect(toJSON('foobar')).equals('"foobar"');
  });

  it('should serialize a number', () => {
    expect(toJSON(1.2)).equals('1.2');
  });

  it('should serialize a bigint', () => {
    expect(toJSON(12n)).equals('12');
  });

  it('should serialize a boolean', () => {
    expect(toJSON(true)).equals('true');
  });

  it('should serialize according to toJSON method', () => {
    class Foo {
      toJSON() {
        return '"foo"';
      }
    }
    expect(toJSON(new Foo())).equals('"foo"');
  });

  it('should serialize a symbol', () => {
    expect(toJSON(Symbol('a'))).equals('"a"');
  });

  it('should serialize a map', () => {
    const m = new Map().set('a', 1);
    expect(toJSON(m)).equals('{"a":1}');
  });

  it('should serialize an array', () => {
    const a = [1, 'a'];
    expect(toJSON(a)).equals('[1,"a"]');
  });

  it('should serialize an object', () => {
    const x = { a: 5, b: false };
    expect(toJSON(x)).equals('{"a":5,"b":false}');
  });
});
