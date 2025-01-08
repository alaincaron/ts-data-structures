import { expect } from 'chai';
import { iterator } from 'ts-fluent-iterators';
import { mergeIteratorWith } from '../../src';

describe('mergeIteratorWith', () => {
  it('should merge iterators', () => {
    expect(
      iterator([1, 5])
        .transform(mergeIteratorWith([[3, 4, 10], [2, 6, 9, 13], [12], [7, 8, 11]]))
        .collect()
    ).deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });
});
