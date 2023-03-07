import { getSome } from './builder-fetchers';
import { server } from '../mocks/server';
import { buildquickPages } from '../mocks/data';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

describe('getSome', () => {
  it('should work', () => {
    expect(getSome({ model: 'page', apiKey: 'blah' })).resolves.toStrictEqual(
      buildquickPages
    );
  });
});
