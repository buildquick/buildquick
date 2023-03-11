import { BuilderComponent as BuilderIoBuilderComponent } from '@builder.io/react';
import { BuilderComponentProps as BuilderIoBuilderComponentProps } from '@builder.io/react/dist/types/src/components/builder-component.component';
import { ContentItem, Block } from '@buildquick/builder-types';
import { BuilderContent } from './BuilderContent';

type BuilderComponentProps = {
  [P in keyof BuilderIoBuilderComponentProps]: P extends 'content'
    ? ContentItem
    : P extends 'contentLoaded'
    ? (data: unknown, content: ContentItem) => void
    : P extends 'builderBlock'
    ? Block
    : BuilderIoBuilderComponentProps[P];
};

type BuilderComponent = Omit<
  BuilderIoBuilderComponent,
  | keyof React.Component<BuilderIoBuilderComponentProps>
  | 'options'
  | 'content'
  | 'inlinedContent'
  | 'onContentLoaded'
  | 'contentRef'
> & {
  get options(): {
    [O in keyof BuilderIoBuilderComponent['options']]: O extends 'content'
      ? ContentItem
      : O extends 'contentLoaded'
      ? (data: unknown, content: ContentItem) => void
      : O extends 'builderBlock'
      ? Block
      : BuilderIoBuilderComponent['options'][O];
  };
  get inlinedContent(): ContentItem | undefined;
  get content(): ContentItem | undefined;
  onContentLoaded: (data: unknown, content: ContentItem) => void;
  contentRef: BuilderContent | null;
} & React.Component<BuilderComponentProps>;

type BuilderComponentConstructor = new (
  props: Readonly<BuilderComponentProps> | BuilderComponentProps
) => BuilderComponent;

const BuilderComponent =
  BuilderIoBuilderComponent as BuilderComponentConstructor;

export { BuilderComponent };
export default BuilderComponent;
