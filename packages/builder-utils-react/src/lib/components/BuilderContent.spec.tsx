import { render } from '@testing-library/react';

import BuilderContent from './BuilderContent';

describe('BuilderContent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BuilderContent model="page" inline>
        {() => null}
      </BuilderContent>
    );
    expect(baseElement).toBeTruthy();
  });
});
