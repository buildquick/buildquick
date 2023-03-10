import { render } from '@testing-library/react';

import BuilderUtilsReact from './builder-utils-react';

describe('BuilderUtilsReact', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BuilderUtilsReact />);
    expect(baseElement).toBeTruthy();
  });
});
