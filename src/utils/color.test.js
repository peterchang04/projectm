import { expect } from 'chai';
const it = global.it;
const describe = global.describe;
import color from '../../src/utils/color.js';


describe('toRGBA()', () => {
  it('works for short hex', () => {
    expect(color.toRGBA('#ABC')).to.equal('rgba(170,187,204,1)');
    expect(color.toRGBA('#bbb')).to.equal('rgba(187,187,187,1)');
  });
  it('works for full hex', () => {
    expect(color.toRGBA('#AABBCC')).to.equal('rgba(170,187,204,1)');
    expect(color.toRGBA('#BBBBBB')).to.equal('rgba(187,187,187,1)');
    expect(color.toRGBA('#000001')).to.equal('rgba(0,0,1,1)');
  });
  it('works for transparent hex', () => {
    expect(color.toRGBA('#AABBCCFF')).to.equal('rgba(170,187,204,1)');
    expect(color.toRGBA('#BBBBBB00')).to.equal('rgba(187,187,187,0)');
    expect(color.toRGBA('#00000180')).to.equal('rgba(0,0,1,0.5)');
  });
  it('works for rgb()', () => {
    expect(color.toRGBA('rgb(1, 2, 3)')).to.equal('rgba(1,2,3,1)');
    expect(color.toRGBA('rgb(254,213,111)')).to.equal('rgba(254,213,111,1)');
  });
  it('works for rgba()', () => {
    expect(color.toRGBA('rgba(1, 2, 3, .5)')).to.equal('rgba(1,2,3,.5)');
    expect(color.toRGBA('rgba(254,213,111, 0)')).to.equal('rgba(254,213,111,0)');
  });
});
