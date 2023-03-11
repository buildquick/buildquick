import { BuilderContent as BuilderIoBuilderContent } from '@builder.io/react';
import { BuilderContentProps as BuilderIoBuilderContentProps } from '@builder.io/react/dist/types/src/components/builder-content.component';
import { ContentItem } from '@buildquick/builder-types';

type BuilderContentProps<ContentType> = {
  [Property in keyof BuilderIoBuilderContentProps<ContentType>]: Property extends 'content'
    ? ContentItem
    : BuilderIoBuilderContentProps<ContentType>[Property];
} & ({ model: string } | { modelName: string });

type BuilderContent<ContentType extends ContentItem = ContentItem> = Omit<
  BuilderIoBuilderContent<ContentType>,
  keyof React.Component<BuilderIoBuilderContentProps<ContentType>> | 'content'
> &
  React.Component<BuilderContentProps<ContentType>> & { content?: ContentItem };

type BuilderContentConstructor<ContentType extends ContentItem = ContentItem> =
  new (
    props:
      | Readonly<BuilderContentProps<ContentType>>
      | BuilderContentProps<ContentType>
  ) => BuilderContent;

const BuilderContent = BuilderIoBuilderContent as BuilderContentConstructor;

export { BuilderContent };
export default BuilderContent;
