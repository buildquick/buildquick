import { BuilderComponent as BuilderIoBuilderComponent } from '@builder.io/react';
import { BuilderComponentProps as BuilderIoBuilderComponentProps } from '@builder.io/react/dist/types/src/components/builder-component.component';
import { ContentItem } from '@buildquick/builder-types';

type BuilderComponentProps = {
  [P in keyof BuilderIoBuilderComponentProps]: P extends 'content'
    ? ContentItem
    : P extends 'contentLoaded'
    ? (data: unknown, content: ContentItem) => void
    : BuilderIoBuilderComponentProps[P];
};

type BuilderComponent = Omit<
  BuilderIoBuilderComponent,
  'options' | 'content' | 'inlinedContent' | 'content' | 'onContentLoaded'
> & {
  get options(): Omit<
    BuilderIoBuilderComponent['options'],
    'contentLoaded' | 'content'
  > & {
    contentLoaded?: ((data: unknown, content: ContentItem) => void) | undefined;
    content?: ContentItem | undefined;
  };
  get inlinedContent(): ContentItem | undefined;
  get content(): ContentItem | undefined;
  onContentLoaded: (data: unknown, content: ContentItem) => void;
} & React.Component<BuilderComponentProps>;

type BuilderComponentConstructor = new (
  props: Readonly<BuilderComponentProps> | BuilderComponentProps
) => BuilderComponent;

const BuilderComponent =
  BuilderIoBuilderComponent as BuilderComponentConstructor;

export { BuilderComponent };
export default BuilderComponent;
