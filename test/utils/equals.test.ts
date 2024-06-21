import { expect } from 'chai';
import { equalsAny } from '../../src';

describe('equalsAny', () => {
  it('should return false for null and undefined', () => {
    expect(equalsAny(null, undefined)).to.be.false;
  });
  describe('Set comparison', () => {
    it('should return true if Sets have same elements', () => {
      const a = new Set().add(1).add(2);
      const b = new Set().add(2).add(1);
      expect(equalsAny(a, b)).to.be.true;
    });
    it('should return false if Sets have different elements', () => {
      const a = new Set().add(1).add(2);
      const b = new Set().add(2);
      expect(equalsAny(a, b)).to.be.false;
    });
  });
  describe('Map comparison', () => {
    it('should return true if Maps have same elements', () => {
      const a = new Map().set('a', 1).set('b', 2);
      const b = new Map().set('b', 2).set('a', 1);
      expect(equalsAny(a, b)).to.be.true;
    });
    it('should return false if Maps have different elements', () => {
      const a = new Map().set('a', 1).set('b', 2);
      const b = new Map().set('a', 1).set('b', 3);
      expect(equalsAny(a, b)).to.be.false;
    });
  });
  describe('Object comparison', () => {
    it('should return true if object have same key/values', () => {
      const a = { x: 1, y: 2 };
      const b = { y: 2, x: 1 };
      expect(equalsAny(a, b)).to.be.true;
    });
    it('should return false if object have different key/values', () => {
      const a = { x: 1, y: 2 };
      const b = { y: 1, x: 2 };
      expect(equalsAny(a, b)).to.be.false;
    });
  });
});
