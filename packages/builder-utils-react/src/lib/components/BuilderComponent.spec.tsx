import { render } from '@testing-library/react';

import BuilderComponent from './BuilderComponent';

describe('BuilderComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BuilderComponent inlineContent />);
    expect(baseElement).toBeTruthy();
  });
});
