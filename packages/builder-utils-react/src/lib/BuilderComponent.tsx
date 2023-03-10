import { forwardRef } from 'react';
import { BuilderComponent as BuilderIoBuilderComponent } from '@builder.io/react';
import { BuilderComponentProps as BuilderIoBuilderComponentProps } from '@builder.io/react/dist/types/src/components/builder-component.component';
import { BuilderContent } from '@builder.io/sdk/dist/src/types/content.d';
import { ContentItem } from '@buildquick/builder-types';

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
>(({ content, ...props }, ref) => {
  // TODO: Add shared context and state, if needed.
  return (
    <BuilderIoBuilderComponent
      content={content as unknown as BuilderContent}
      ref={ref}
      {...props}
    />
  );
});

export default BuilderComponent;
