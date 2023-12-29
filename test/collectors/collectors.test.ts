import { expect } from 'chai';
import { ArrayList, arrayListCollector, CollectionCollector } from '../../src';

describe('Collectors', () => {
  it('should add items to the wrapped collection', () => {
    const col = new ArrayList<number>();
    const collector = arrayListCollector(col);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result).equal(col);
  });
  it('should add items to the built collection', () => {
    const collector = new CollectionCollector(ArrayList);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result.constructor.name).equals('ArrayList');
  });
});
