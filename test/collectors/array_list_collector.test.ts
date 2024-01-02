import { expect } from 'chai';
import { ArrayList, arrayListCollector } from '../../src';

describe('ArrayListCollector', () => {
  it('should add items to the wrapped collection', () => {
    const col = new ArrayList<number>();
    const collector = arrayListCollector(col);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result).equal(col);
  });
  it('should add items to the built collection', () => {
    const collector = arrayListCollector();
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result.constructor.name).equals('ArrayList');
  });
});
