import { HashMap, OpenHashMap } from '../src';
import { expect } from 'chai';

describe('map-equals', () => {
  it('should return true for same object', () => {
    const m = new HashMap();
    expect(m.equals(m)).to.be.true;
  });

  it('should compare for cloned map', () => {
    const a = new HashMap();
    a.put(1, 2);
    a.put('foo', 'bar');
    a.put(true, 1);
    a.put('x', 5);
    a.put(2n, 5n);
    const b = a.clone();
    expect(a.equals(b)).to.be.true;
    b.clear();
    expect(a.equals(b)).to.be.false;
  });

  it('should compare list of different classes ', () => {
    const a = new HashMap();
    a.put(1, 2);
    a.put('foo', 'bar');
    a.put(true, 1);
    a.put('x', 5);
    a.put(2n, 5n);
    const b = OpenHashMap.create({ initial: a });
    expect(a.equals(b)).to.be.true;
    expect(b.equals(a)).to.be.true;
    b.clear();
    expect(a.equals(b)).to.be.false;
    expect(b.equals(a)).to.be.false;
  });
});
