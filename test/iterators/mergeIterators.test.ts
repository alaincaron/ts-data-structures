import { expect } from 'chai';
import { iterator } from 'ts-fluent-iterators';
import { mergeIteratorWith } from '../../src';

describe('mergeIteratorWith', () => {
  it('should merge iterators', () => {
    expect(
      iterator([1, 5])
        .transform(
          mergeIteratorWith([
            [3, 4],
            [2, 6],
          ])
        )
        .collect()
    ).deep.equal([1, 2, 3, 4, 5, 6]);
  });
});
