import { expect } from 'chai';
import { ArrayList, LinkedList } from '../src';

describe('list-equals', () => {
  it('should return true for same object', () => {
    const a = new ArrayList();
    expect(a.equals(a)).to.be.true;
  });

  it('should compare for cloned list', () => {
    const a = ArrayList.create({ initial: [1, 'foo', true, 2n, { x: 5 }, [1, 2]] });
    const b = a.clone();
    expect(a.equals(b)).to.be.true;
    b.clear();
    expect(a.equals(b)).to.be.false;
  });

  it('should compare list of different classes ', () => {
    const a = ArrayList.create({ initial: [1, 'foo', true, 2n, { x: 5 }, [1, 2]] });
    const b = LinkedList.create({ initial: a });
    expect(a.equals(b)).to.be.true;
    expect(b.equals(a)).to.be.true;
    b.clear();
    expect(a.equals(b)).to.be.false;
    expect(b.equals(a)).to.be.false;
  });
});
