import { parseHandlebars } from './parse-handlebars';

const data = {
  world: 'Earth',
  bar: 'hi',
};

const filters = {
  toLowerCase: (val: unknown) => val?.toString()?.toLowerCase() || val,
};

describe('parseHandlebars', () => {
  it('should work', () => {
    expect(parseHandlebars('Hello, {{world}}', data)).toStrictEqual(
      'Hello, Earth'
    );
  });

  it('should return an empty string for an invalid reference', () => {
    expect(parseHandlebars('Hello, {{worl}}', data)).toStrictEqual('Hello, ');
  });

  it('should work with filters', () => {
    expect(
      parseHandlebars('Hello, {{world | toLowerCase}}', data, filters)
    ).toStrictEqual('Hello, earth');
  });
});
