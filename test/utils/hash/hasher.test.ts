import { expect } from 'chai';
import { Buffer } from 'node:buffer';
import { AbstractHasher, Cyrb53Hasher, FNV1a32Hasher, HashCode, Numeric32HashCode } from '../../../src';

describe('Hasher Utilities', () => {
  describe('Numeric32HashCode', () => {
    it('should return the correct number value', () => {
      const hashCode = new Numeric32HashCode(12345);
      expect(hashCode.asNumber()).to.equal(12345);
    });

    it('should return a 32-bit representation', () => {
      const hashCode = new Numeric32HashCode(Number.MAX_SAFE_INTEGER);
      expect(hashCode.bits()).to.equal(32);
    });

    it('should return the correct buffer representation', () => {
      const value = 12345;
      const hashCode = new Numeric32HashCode(value);
      const buffer = hashCode.asBuffer();
      expect(buffer).to.deep.equal(Buffer.from([0x00, 0x00, 0x30, 0x39])); // 12345 in Big Endian
    });
  });

  describe('Cyrb53Hasher', () => {
    let hasher: Cyrb53Hasher;

    beforeEach(() => {
      hasher = new Cyrb53Hasher(0);
    });

    it('should hash numbers correctly', () => {
      hasher.putNumber(42);
      const hash = hasher.hash();
      expect(hash.asNumber()).to.be.a('number');
      expect(hash.bits()).to.equal(53);
    });

    it('should hash strings correctly', () => {
      hasher.putString('test');
      const hash = hasher.hash();
      expect(hash.asNumber()).to.be.a('number');
    });

    it('should hash boolean values correctly', () => {
      hasher.putBoolean(true);
      hasher.putBoolean(false);
      const hash = hasher.hash();
      expect(hash.asNumber()).to.be.a('number');
    });

    it('should hash buffers correctly', () => {
      hasher.putBytes(Buffer.from([1, 2, 3, 4]));
      const hash = hasher.hash();
      expect(hash.asNumber()).to.be.a('number');
    });

    it('should hash objects using a funnel', () => {
      const funnel = {
        funnel: (obj: { id: number }, hasher: Cyrb53Hasher) => {
          hasher.putNumber(obj.id);
        },
      };
      hasher.putObject({ id: 123 }, funnel);
      const hash = hasher.hash();
      expect(hash.asNumber()).to.be.a('number');
    });
  });

  describe('FNV1a32Hasher', () => {
    let hasher: FNV1a32Hasher;

    beforeEach(() => {
      hasher = new FNV1a32Hasher();
    });

    it('should hash numbers correctly', () => {
      hasher.putNumber(123);
      const hash = hasher.hash();
      expect(hash.asNumber()).to.be.a('number');
      expect(hash.bits()).to.equal(32);
    });

    it('should hash strings correctly', () => {
      hasher.putString('example');
      const hash = hasher.hash();
      expect(hash.asNumber()).to.be.a('number');
    });

    it('should hash booleans correctly', () => {
      hasher.putBoolean(true);
      const hash = hasher.hash();
      expect(hash.asNumber()).to.be.a('number');
    });

    it('should hash buffers correctly', () => {
      hasher.putBytes(Buffer.from([0xde, 0xad, 0xbe, 0xef]));
      const hash = hasher.hash();
      expect(hash.asNumber()).to.be.a('number');
    });

    it('should generate consistent hash for the same input', () => {
      const hasher1 = new FNV1a32Hasher();
      hasher1.putString('fixed input');

      const hasher2 = new FNV1a32Hasher();
      hasher2.putString('fixed input');

      expect(hasher1.hash().asNumber()).to.equal(hasher2.hash().asNumber());
    });
  });

  describe('AbstractHasher', () => {
    class MockHasher extends AbstractHasher {
      private sum = 0;

      protected update(value: number) {
        this.sum += value;
      }

      hash(): HashCode {
        return new Numeric32HashCode(this.sum);
      }
    }

    it('should correctly update and hash with custom implementation', () => {
      const hasher = new MockHasher();
      hasher.putNumber(10).putString('abc').putBoolean(true);
      const hash = hasher.hash();
      expect(hash.asNumber()).to.be.a('number');
    });

    it('should hash numbers and strings consistently', () => {
      const hasher = new MockHasher();
      const hash1 = hasher.putNumber(10).putString('abc').hash();
      const hash2 = hasher.putNumber(10).putString('abc').hash();
      expect(hash1.asNumber()).to.equal(hash2.asNumber());
    });
  });
});
