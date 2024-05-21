import { expect } from 'chai';
import { Collectors, iterator } from 'ts-fluent-iterators';
import { MovingAverageCollector, SumWindowCollector, windowIteratorMapper } from '../../src';

describe('window', () => {
  describe('with windowCollector', () => {
    it('should compute a moving sum from the start', () => {
      const actual = iterator([1, 2, 3, 4, 5]).transform(windowIteratorMapper(new SumWindowCollector(), 2)).collect();
      const expected = [1, 3, 5, 7, 9];
      expect(actual).deep.equal(expected);
    });
    it('should compute a moving sum from the 2nd element', () => {
      const actual = iterator([1, 2, 3, 4, 5])
        .transform(windowIteratorMapper(new SumWindowCollector(), 2, false))
        .collect();
      const expected = [3, 5, 7, 9];
      expect(actual).deep.equal(expected);
    });
    it('should compute a moving average with window of 2', () => {
      const actual = iterator([1, 2, 3, 4, 5])
        .transform(windowIteratorMapper(new MovingAverageCollector(), 2))
        .collect();
      const expected = [1, 1.5, 2.5, 3.5, 4.5];
      expect(actual).deep.equal(expected);
    });
    it('should compute a moving average from the 2nd element', () => {
      const actual = iterator([1, 2, 3, 4, 5])
        .transform(windowIteratorMapper(new MovingAverageCollector(), 2, false))
        .collect();
      const expected = [1.5, 2.5, 3.5, 4.5];
      expect(actual).deep.equal(expected);
    });
    it('should compute a moving average with window of 3', () => {
      const actual = iterator([1, 2, 3, 4, 5])
        .transform(windowIteratorMapper(new MovingAverageCollector(), 3))
        .collect();
      const expected = [1, 1.5, 2, 3.0, 4.0];
      expect(actual).deep.equal(expected);
    });
  });
  describe('with collector factory', () => {
    it('should compute a moving sum from the start', () => {
      const actual = iterator([1, 2, 3, 4, 5])
        .transform(windowIteratorMapper(() => new Collectors.SumCollector(), 2))
        .collect();
      const expected = [1, 3, 5, 7, 9];
      expect(actual).deep.equal(expected);
    });
    it('should compute a moving sum from the 2nd element', () => {
      const actual = iterator([1, 2, 3, 4, 5])
        .transform(windowIteratorMapper(() => new Collectors.SumCollector(), 2, false))
        .collect();
      const expected = [3, 5, 7, 9];
      expect(actual).deep.equal(expected);
    });
    it('should compute a moving average with window of 2', () => {
      const actual = iterator([1, 2, 3, 4, 5])
        .transform(windowIteratorMapper(() => new Collectors.AvgCollector(), 2))
        .collect();
      const expected = [1, 1.5, 2.5, 3.5, 4.5];
      expect(actual).deep.equal(expected);
    });
    it('should compute a moving average from the 2nd element', () => {
      const actual = iterator([1, 2, 3, 4, 5])
        .transform(windowIteratorMapper(() => new Collectors.AvgCollector(), 2, false))
        .collect();
      const expected = [1.5, 2.5, 3.5, 4.5];
      expect(actual).deep.equal(expected);
    });
    it('should compute a moving average with window of 3', () => {
      const actual = iterator([1, 2, 3, 4, 5])
        .transform(windowIteratorMapper(() => new Collectors.AvgCollector(), 3))
        .collect();
      const expected = [1, 1.5, 2, 3.0, 4.0];
      expect(actual).deep.equal(expected);
    });
  });
});
