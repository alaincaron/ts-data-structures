import { expect } from 'chai';
import { Comparators } from 'ts-fluent-iterators';
import { EmptyList } from '../../src/immutables/emptyList';
import { List } from '../../src/lists';
import { ArrayList } from '../../src/lists/array_list';
import { IndexOutOfBoundsException } from '../../src/utils';

describe('EmptyList', () => {
  let emptyList: List<number>;

  beforeEach(() => {
    emptyList = EmptyList.instance<number>();
  });

  describe('instance', () => {
    it('should always return the same instance', () => {
      const list1 = EmptyList.instance<number>();
      const list2 = EmptyList.instance<string>();
      expect(list1).to.equal(list2);
    });
  });

  describe('getAt', () => {
    it('should throw IndexOutOfBoundsException', () => {
      expect(() => emptyList.getAt(0)).to.throw(IndexOutOfBoundsException);
    });
  });

  describe('getFirst/getLast', () => {
    it('should throw IndexOutOfBoundsException for getFirst', () => {
      expect(() => emptyList.getFirst()).to.throw(IndexOutOfBoundsException);
    });

    it('should throw IndexOutOfBoundsException for getLast', () => {
      expect(() => emptyList.getLast()).to.throw(IndexOutOfBoundsException);
    });
  });

  describe('iterators', () => {
    it('should return empty iterator', () => {
      expect(emptyList.iterator().next().done).to.be.true;
    });

    it('should return empty reverse iterator', () => {
      expect(emptyList.reverseIterator().next().done).to.be.true;
    });

    it('should throw for listIterator with skip/count', () => {
      expect(() => emptyList.listIterator(1)).to.throw(IndexOutOfBoundsException);
      expect(() => emptyList.listIterator(0, 1)).to.throw(IndexOutOfBoundsException);
    });

    it('should throw for reverseListIterator with skip/count', () => {
      expect(() => emptyList.reverseListIterator(1)).to.throw(IndexOutOfBoundsException);
      expect(() => emptyList.reverseListIterator(0, 1)).to.throw(IndexOutOfBoundsException);
    });

    it('should return empty listIterator without arguments', () => {
      expect(emptyList.listIterator().next().done).to.be.true;
    });

    it('should return empty reverseListIterator without arguments', () => {
      expect(emptyList.reverseListIterator().next().done).to.be.true;
    });
  });

  describe('indexOf methods', () => {
    it('should return -1 for indexOfFirstOccurrence', () => {
      expect(emptyList.indexOfFirstOccurrence(() => true)).to.equal(-1);
    });

    it('should return -1 for indexOf', () => {
      expect(emptyList.indexOf(1)).to.equal(-1);
    });

    it('should return -1 for indexOfLastOccurrence', () => {
      expect(emptyList.indexOfLastOccurrence(() => true)).to.equal(-1);
    });

    it('should return -1 for lastIndexOf', () => {
      expect(emptyList.lastIndexOf(1)).to.equal(-1);
    });
  });

  describe('peek methods', () => {
    it('should return undefined for peekFirst', () => {
      expect(emptyList.peekFirst()).to.be.undefined;
    });

    it('should return undefined for peekLast', () => {
      expect(emptyList.peekLast()).to.be.undefined;
    });
  });

  describe('equals', () => {
    it('should return true for same instance', () => {
      expect(emptyList.equals(emptyList)).to.be.true;
    });

    it('should return false for null/undefined', () => {
      expect(emptyList.equals(null)).to.be.false;
      expect(emptyList.equals(undefined)).to.be.false;
    });

    it('should return true for another empty list', () => {
      const otherEmptyList = new ArrayList();
      expect(emptyList.equals(otherEmptyList)).to.be.true;
    });

    it('should return false for non-empty list', () => {
      const nonEmptyList = ArrayList.create({ initial: [1] });
      expect(emptyList.equals(nonEmptyList)).to.be.false;
    });
  });

  describe('isOrdered/isStrictlyOrdered', () => {
    it('should return true for isOrdered without arguments', () => {
      expect(emptyList.isOrdered()).to.be.true;
    });

    it('should return true for isOrdered with comparator', () => {
      expect(emptyList.isOrdered(Comparators.natural)).to.be.true;
    });

    it('should throw for isOrdered with invalid range', () => {
      expect(() => emptyList.isOrdered(1)).to.throw(IndexOutOfBoundsException);
      expect(() => emptyList.isOrdered(0, 1)).to.throw(IndexOutOfBoundsException);
    });

    it('should return true for isStrictlyOrdered without arguments', () => {
      expect(emptyList.isStrictlyOrdered()).to.be.true;
    });

    it('should return true for isStrictlyOrdered with comparator', () => {
      expect(emptyList.isStrictlyOrdered(Comparators.natural)).to.be.true;
    });

    it('should throw for isStrictlyOrdered with invalid range', () => {
      expect(() => emptyList.isStrictlyOrdered(1)).to.throw(IndexOutOfBoundsException);
      expect(() => emptyList.isStrictlyOrdered(0, 1)).to.throw(IndexOutOfBoundsException);
    });
  });
});
