import { ArrayList, ArrayListCollector } from '../src/';
import { expect } from 'chai';

describe('Collectors', () => {
  it('should add items to the wrapped collection', () => {
    const col = new ArrayList<number>();
    const collector = new ArrayListCollector(col);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result).equal(col);
  });
  it('should add items to the built collection', () => {
    const collector = new ArrayListCollector();
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
  });
});
