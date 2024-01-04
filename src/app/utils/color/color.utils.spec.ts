import { convertColorFromCssToHSLCommon } from './color.utils';
describe('Utils', () => {
  it('should correctly convert Color Hex to HSL', () => {
    let hsl: number[] = convertColorFromCssToHSLCommon('#2a4c68');
    expect(hsl).toEqual([207, 42.5, 28.6]);
    hsl = convertColorFromCssToHSLCommon('#000000');
    expect(hsl).toEqual([0, 0, 0]);
    hsl = convertColorFromCssToHSLCommon('#ffffff');
    expect(hsl).toEqual([0, 0, 100]);
    hsl = convertColorFromCssToHSLCommon('#FFF');
    expect(hsl).toEqual([0, 0, 100]);
    hsl = convertColorFromCssToHSLCommon('#fFf');
    expect(hsl).toEqual([0, 0, 100]);
  });

  it('should correctly convert Color RGB to HSL', () => {
    let hsl: number[] = convertColorFromCssToHSLCommon('rgb(42, 76, 104)');
    expect(hsl).toEqual([207, 42.5, 28.6]);
    hsl = convertColorFromCssToHSLCommon('rgb(255, 255, 255)');
    expect(hsl).toEqual([0, 0, 100]);
    hsl = convertColorFromCssToHSLCommon('rgb(0, 0, 0)');
    expect(hsl).toEqual([0, 0, 0]);
    hsl = convertColorFromCssToHSLCommon('rgb(0,0,0)');
    expect(hsl).toEqual([0, 0, 0]);
  });

  it('should throw an error for invalid hex input', () => {
    expect(() => convertColorFromCssToHSLCommon('#11223344')).toThrow(new Error('Invalid Color Hex length "#11223344"'));
    expect(() => convertColorFromCssToHSLCommon('ffffff')).toThrow(new Error('Invalid Color Format "ffffff"'));
    expect(() => convertColorFromCssToHSLCommon('DDD')).toThrow(new Error('Invalid Color Format "DDD"'));
    expect(() => convertColorFromCssToHSLCommon('#1122XX')).toThrow(new Error('Invalid Color Hex Format "#1122XX"'));
    expect(() => convertColorFromCssToHSLCommon('rgb(255, 255)')).toThrow(new Error('Invalid RGB Color Format "rgb(255, 255)"'));
    expect(() => convertColorFromCssToHSLCommon('rgb(255,255,)')).toThrow(new Error('Invalid RGB Color Format "rgb(255,255,)"'));
  });
});
