import { ColourMap } from './colourmap';
import { Colour } from './shared/types/colour.type';

describe('colourMap', () => {
  let sut: ColourMap;
  beforeEach(() => {
    sut = new ColourMap();
    sut.set(0, Colour.fromRGBA(44, 18, 0, 255));
    sut.set(0.25, Colour.fromRGBA(101, 58, 7, 255));
    sut.set(0.5, Colour.fromRGBA(199, 145, 65, 255));
    sut.set(0.75, Colour.fromRGBA(238, 219, 172, 255));
    sut.set(1, Colour.fromRGBA(199, 234, 229, 255));
  });

  it('createColorBufferFromColorMap should call calculateColorAsPercentage', () => {
    sut.valuePercentages = true;
    const spy: jasmine.Spy = spyOn(<any>sut, 'calculateColorAsPercentage');

    sut.calculateColorNotingIsValuesPercentages(0.5, 0, 1);

    expect(spy).toHaveBeenCalled();
  });

  it('calculateColorNotingIsValuesPercentages should call calculateColorAsPercentage', () => {
    sut.valuePercentages = true;
    const calculateColorAsPercentageSpy: jasmine.Spy = spyOn(<any>sut, 'calculateColorAsPercentage');

    sut['calculateColorNotingIsValuesPercentages'](1, 0, 1);

    expect(calculateColorAsPercentageSpy).toHaveBeenCalled();
  });

  it('calculateColorAsPercentage should call calculateColor', () => {
    const calculateColorSpy: jasmine.Spy = spyOn(<any>sut, 'calculateColor');

    sut['calculateColorAsPercentage'](1, 0, 1);

    expect(calculateColorSpy).toHaveBeenCalled();
  });

  it('floorKeyEntry should return entry or next lowest', () => {
    const [key, color] = sut['floorKeyEntry'](0.75);
    const [key1, color2] = sut['floorKeyEntry'](0.65);

    expect(key).toBe(0.75);
    expect(key1).toBe(0.5);

    const [r, g, b] = color.getRGB();
    expect(r).toBe(238);
    expect(g).toBe(219);
    expect(b).toBe(172);

    const [r2, g2, b2] = color2.getRGB();
    expect(r2).toBe(199);
    expect(g2).toBe(145);
    expect(b2).toBe(65);
  });

  it('ceilingEntry should return entry or next highest', () => {
    const [key, color] = sut['ceilingKeyEntry'](0.75);
    const [key1, color2] = sut['ceilingKeyEntry'](0.85);

    expect(key).toBe(0.75);
    const [r, g, b] = color.getRGB();
    expect(r).toBe(238);
    expect(g).toBe(219);
    expect(b).toBe(172);

    expect(key1).toBe(1);
    const [r2, g2, b2] = color2.getRGB();
    expect(r2).toBe(199);
    expect(g2).toBe(234);
    expect(b2).toBe(229);
  });

  it('calculateColor should call floorKeyEntry', () => {
    spyOn(<any>sut, 'floorKeyEntry').and.returnValue([1, Colour.fromRGBA(0.0, 0.0, 0.0)]);
    spyOn(<any>sut, 'ceilingKeyEntry').and.returnValue([2, Colour.fromRGBA(1.0, 1.0, 1.0)]);

    const rgb: number[] = sut['calculateColor'](1);

    expect(rgb.length).toBe(3);
  });

  it('calculateColor should set mixer to zero', () => {
    spyOn(<any>sut, 'floorKeyEntry').and.returnValue([1, Colour.fromRGBA(0.0, 0.0, 0.0)]);
    spyOn(<any>sut, 'ceilingKeyEntry').and.returnValue(null);

    const rgb: number[] = sut['calculateColor'](1);
    expect(rgb).toEqual([0.0, 0.0, 0.0]);
  });

  it('key should return key related to specified value', () => {
    const colour0: Colour = Colour.fromRGBA(255, 255, 255, 255);
    const colour1: Colour = Colour.fromRGBA(0, 0, 0, 255);
    sut.set(0, colour0);
    sut.set(1, colour1);

    const key: number = sut.key(colour0);

    expect(key).toBe(0);
  });

  it('keys should return a list of key values', () => {
    const keys: number[] = sut.keys();

    expect(keys.length).toBe(5);
    expect(keys).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it('invertColours should return a colourmap with  pivoted around midpoint', () => {
    const c0: Colour = sut.get(0);
    const c1: Colour = sut.get(0.25);
    const c2: Colour = sut.get(0.5);
    const c3: Colour = sut.get(0.75);
    const c4: Colour = sut.get(1);

    const inverted: any = sut.invertColours();

    const cInverted0: Colour = inverted.get(0);
    const cInverted1: Colour = inverted.get(0.25);
    const cInverted2: Colour = inverted.get(0.5);
    const cInverted3: Colour = inverted.get(0.75);
    const cInverted4: Colour = inverted.get(1);

    expect(c0).toBe(cInverted4);
    expect(c1).toBe(cInverted3);
    expect(c2).toBe(cInverted2);
    expect(c3).toBe(cInverted1);
    expect(c4).toBe(cInverted0);
  });

  it('closestEntry should return closest entry', () => {
    const map: ColourMap<number> = new ColourMap<number>();
    map.set(0, 10);
    map.set(1, 75);
    map.set(2, 150);

    const closestEntry: any = map.closestEntry(50);

    expect(closestEntry).toBe(1);
  });

  it('initLogColourMap should initialise logColourMap', () => {
    const colourMap: ColourMap = new ColourMap();
    const min: number = 1;
    const max: number = 100;
    colourMap.set(0, Colour.fromRGBA(44, 18, 0, 255));
    colourMap.set(0.25, Colour.fromRGBA(101, 58, 7, 255));
    colourMap.set(0.5, Colour.fromRGBA(199, 145, 65, 255));
    colourMap.set(0.75, Colour.fromRGBA(238, 219, 172, 255));
    colourMap.set(1, Colour.fromRGBA(199, 234, 229, 255));

    colourMap['initLogColourMap'](min, max);

    expect(colourMap.logarithmicValues).toBeTruthy();
  });

  it('createColorBufferFromColorMap should set black for noDataValues', () => {
    const positions: number[] = [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE];
    const colourMap: ColourMap = new ColourMap<Colour>();
    const min: number = 1;
    const max: number = 100;

    const colorBuffer: number[] = ColourMap['createColorBufferFromColorMap'](positions, colourMap, min, max);

    expect(colorBuffer.length).toBe(positions.length);
    expect(colorBuffer[0]).toBe(0);
    expect(colorBuffer[1]).toBe(0);
    expect(colorBuffer[2]).toBe(0);
  });
});
