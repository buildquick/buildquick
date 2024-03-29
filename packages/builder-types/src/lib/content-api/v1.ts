import {
  BlockWithChildrenBase,
  BlockWithoutChildrenBase,
  ContentItemBase,
  ContentItemData,
  ContentItemVariantBase,
  CustomComponentBase,
  DefaultSchemaDataBase,
  ReferenceBase,
  SymbolBase,
} from './base';

export type ReferenceV1 = ReferenceBase & { value?: ContentItemV1 };
export type DefaultSchemaDataV1 = DefaultSchemaDataBase<ReferenceV1>;
export type BlockWithChildrenV1 = BlockWithChildrenBase<ReferenceV1, BlockV1>;
export type BlockWithoutChildrenV1 = BlockWithoutChildrenBase<ReferenceV1>;
export type SymbolV1 = SymbolBase<ReferenceV1, ContentItemV1>;
export type CustomComponentV1 = CustomComponentBase<ReferenceV1>;
export type BlockV1 =
  | BlockWithChildrenV1
  | BlockWithoutChildrenV1
  | SymbolV1
  | CustomComponentV1;

export type ContentItemDataV1<SchemaData = DefaultSchemaDataV1> =
  ContentItemData<ReferenceV1, BlockV1, SchemaData>;

export interface ContentItemV1<SchemaData = DefaultSchemaDataV1>
  extends ContentItemBase<
    ContentItemDataV1<SchemaData>,
    ContentItemVariantV1<ContentItemDataV1<SchemaData>>,
    ReferenceV1
  > {}

export interface ContentItemVariantV1<Data>
  extends ContentItemVariantBase<Data, ContentItemV1<Data>> {}

export type ContentApiResponseV1<
  Model extends string = string,
  SchemaData = DefaultSchemaDataV1
> = Record<Model, ContentItemV1<SchemaData>[]>;
