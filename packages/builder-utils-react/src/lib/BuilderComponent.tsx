import { forwardRef } from 'react';
import { BuilderComponent as BuilderIoBuilderComponent } from '@builder.io/react';
import { BuilderComponentProps as BuilderIoBuilderComponentProps } from '@builder.io/react/dist/types/src/components/builder-component.component';
import { BuilderContent } from '@builder.io/sdk/dist/src/types/content.d';
import { ContentItem } from '@buildquick/builder-types';
import {
  waitForElement,
  waitForElements,
  waitForRef,
} from '@buildquick/builder-utils';

interface BuilderComponentProps
  extends Omit<BuilderIoBuilderComponentProps, 'content'> {
  /**
   * Manually specify what Builder content JSON object to render. @see {@link
   * https://github.com/BuilderIO/builder/tree/master/packages/react#passing-content-manually}
   */
  content?: ContentItem;
}

export const BuilderComponent = forwardRef<
  BuilderIoBuilderComponent,
  BuilderComponentProps
>(({ content, context, ...props }, ref) => {
  return (
    <BuilderIoBuilderComponent
      content={content as unknown as BuilderContent}
      context={{
        buildquick: {
          utils: {
            waitForElement,
            waitForElements,
            waitForRef,
          },
        },
        ...context,
      }}
      ref={ref}
      {...props}
    />
  );
});

export default BuilderComponent;
