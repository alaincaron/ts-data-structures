import { CircularBuffer } from '../src/circular_buffer';
import { expect } from 'chai';

describe('CircularBuffer', () => {
  describe('constructor', () => {
    it('should have the specified capacity', () => {
      const buffer = new CircularBuffer(2);
      expect(buffer.capacity()).equal(2);
      expect(buffer.size()).equal(0);
      expect(buffer.isEmpty()).to.be.true;
      expect(buffer.isFull()).to.be.false;
    });

    it('should have the same elements as the array argument', () => {
      const arr = [1, 2];
      const buffer = new CircularBuffer(arr);
      expect(buffer.capacity()).equal(2);
      expect(buffer.size()).equal(2);
      expect(buffer.isEmpty()).to.be.false;
      expect(buffer.isFull()).to.be.true;
      expect(buffer.toArray()).to.deep.equal(arr);
    });

    it('should be identical to the CircularBuffer argument', () => {
      const arr = [1, 2];
      const buffer1 = new CircularBuffer(arr);
      const buffer2 = new CircularBuffer(buffer1);
      expect(buffer2).to.deep.equal(buffer1);
    });

    it('should use the CircularBuffer like argument', () => {
      const arr = Array.from({ length: 2 }, (_, i) => i + 1);
      const buffer = new CircularBuffer({ capacity: arr.length, f: i => i + 1 });
      expect(buffer.toArray()).to.deep.equal(arr);
    });
  });
});
