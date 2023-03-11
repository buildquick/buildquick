import { ContentItem } from '@buildquick/builder-types';
import { render } from '@testing-library/react';

import BuilderComponent from './BuilderComponent';

describe('BuilderComponent', () => {
  it('should render successfully', () => {
    const content = {} as unknown as ContentItem;
    const { baseElement } = render(
      <BuilderComponent inlineContent content={content} />
    );
    expect(baseElement).toBeTruthy();
  });
});
