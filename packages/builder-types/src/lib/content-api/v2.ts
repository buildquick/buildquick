import {
  BlockWithChildrenBase,
  BlockWithoutChildrenBase,
  ContentItemBase,
  ContentItemData,
  ContentItemVariantBase,
  CustomComponentBase,
  DefaultSchemaDataType,
  ReferenceBase,
  SymbolBase,
} from './base';

export type ReferenceV2 = ReferenceBase & { value?: ContentItemV2 };

export type BlockWithChildrenV2 = BlockWithChildrenBase<
  ReferenceV2,
  BlockWithChildrenV2
>;
export type BlockWithoutChildrenV2 = BlockWithoutChildrenBase<ReferenceV2>;
export type SymbolV2 = SymbolBase<ReferenceV2, ContentItemV2>;
export type CustomComponentV2 = CustomComponentBase<ReferenceV2>;
export type BlockV2 =
  | BlockWithChildrenV2
  | BlockWithoutChildrenV2
  | SymbolV2
  | CustomComponentV2;

export type ContentItemDataV2<
  SchemaData = DefaultSchemaDataType<ReferenceV2, BlockV2>
> = ContentItemData<ReferenceV2, BlockV2, SchemaData>;

export interface ContentItemV2<
  SchemaData = DefaultSchemaDataType<ReferenceV2, BlockV2>
> extends ContentItemBase<
    ContentItemDataV2<SchemaData>,
    ContentItemVariantV2<ContentItemDataV2<SchemaData>>,
    ReferenceV2
  > {}

export interface ContentItemVariantV2<Data>
  extends ContentItemVariantBase<Data, ContentItemV2<Data>> {}

export type ContentApiResponseV2<
  SchemaData = DefaultSchemaDataType<ReferenceV2, BlockV2>
> = {
  results: ContentItemV2<ContentItemDataV2<SchemaData>>[];
};
