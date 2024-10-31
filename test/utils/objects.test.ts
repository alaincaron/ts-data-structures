import { expect } from 'chai';
import { deepFilter, deepSortKeys, pick, removeEmpty, removeNull, sortKeys } from '../../src/utils/objects';

describe('Objects', () => {
  describe('pick', () => {
    it('should return empty object', () => {
      const x = { a: 1, b: 2 };
      expect(pick(x)).to.deep.equal({});
    });
    it('should return only specified keys', () => {
      const x = { a: 1, b: 2 };
      expect(pick(x, 'a')).to.deep.equal({ a: 1 });
    });
  });

  describe('removeNull', () => {
    it('should remove null and undefined values', () => {
      const x = { a: null, b: undefined, c: 0, s: '' };
      expect(removeNull(x)).to.deep.equal({ c: 0, s: '' });
    });
  });

  describe('removeEmpty', () => {
    it('should remove null, undefined and empty strings', () => {
      const x = { a: null, b: undefined, c: 0, s: '', s1: 'foo' };
      expect(removeEmpty(x)).to.deep.equal({ c: 0, s1: 'foo' });
    });
  });

  describe('deepFilter', () => {
    it('should remove null or undefined values recursively', () => {
      const x = [1, { a: null, b: undefined, c: { x: 5, y: null } }];
      expect(deepFilter(x, ([_, v]) => v != null)).to.deep.equal([1, { c: { x: 5 } }]);
    });
  });

  describe('sortKeys', () => {
    it('should keys according to natural order', () => {
      const x = { z: 1, b: 2, d: 4, a: 3 };
      const sortedX = sortKeys(x);
      expect(Object.keys(sortedX)).to.deep.equal(['a', 'b', 'd', 'z']);
      expect(sortedX).to.deep.equal(x);
      expect(sortedX).not.equal(x);
    });
  });

  describe('deepSortKeys', () => {
    it('should sort keys recursively', () => {
      const x = [1, { z: 5, a: null, b: undefined, c: { z: 45, x: 5, y: null } }];
      const sortedX = deepSortKeys(x) as unknown[];
      expect(sortedX.length).eq(x.length);
      expect(sortedX[0]).eq(x[0]);
      const h = sortedX[1] as Record<string, unknown>;
      expect(Object.keys(h)).deep.equal(['a', 'b', 'c', 'z']);
      const c = h.c as Record<string, unknown>;
      expect(Object.keys(c)).deep.equal(['x', 'y', 'z']);
      expect(sortedX).to.deep.equal(x);
    });
  });
});
