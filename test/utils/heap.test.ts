import { expect } from 'chai';
import { Heap } from '../../src';

describe('Heap', () => {
  it('should heapify array', () => {
    const a = Array.from({ length: 250 }, (_, i) => i);
    a.shuffle();
    expect(Heap.isHeap(a)).to.be.false;
    Heap.heapify(a);
    expect(Heap.isHeap(a)).to.be.true;
  });

  it('should remove elements in the right order', () => {
    const a = Array.from({ length: 250 }, (_, i) => i);
    a.shuffle();
    Heap.heapify(a);
    for (let i = 0; i < 250; ++i) {
      expect(Heap.remove(a)).equal(i);
      expect(a.length).equal(250 - i - 1);
    }
    expect(Heap.remove(a)).to.be.undefined;
  });
});
