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

export type ReferenceV3 = ReferenceBase & { data?: ContentItemV3 };
export type DefaultSchemaDataV3 = DefaultSchemaDataBase<ReferenceV3>;
export type BlockWithChildrenV3 = BlockWithChildrenBase<ReferenceV3, BlockV3>;
export type BlockWithoutChildrenV3 = BlockWithoutChildrenBase<ReferenceV3>;
export type SymbolV3 = SymbolBase<ReferenceV3, ContentItemV3>;
export type CustomComponentV3 = CustomComponentBase<ReferenceV3>;
export type BlockV3 =
  | BlockWithChildrenV3
  | BlockWithoutChildrenV3
  | SymbolV3
  | CustomComponentV3;

export type ContentItemDataV3<SchemaData = DefaultSchemaDataV3> =
  ContentItemData<ReferenceV3, BlockV3, SchemaData>;

export interface ContentItemV3<SchemaData = DefaultSchemaDataV3>
  extends Omit<
    ContentItemBase<
      ContentItemData<ReferenceV3, BlockV3, SchemaData>,
      ContentItemVariantV3<ContentItemData<ReferenceV3, BlockV3, SchemaData>>,
      ReferenceV3
    >,
    'data' | 'meta'
  > {
  data: ContentItemData<ReferenceV3, BlockV3, SchemaData>;
  lastUpdateBy?: null;
  meta: Omit<
    ContentItemBase<
      SchemaData,
      ContentItemVariantV3<SchemaData>,
      ReferenceV3
    >['meta'],
    'needsHydration'
  >;
  metrics?: {
    clicks: number;
    impressions: number;
  };
  priority?: number;
}

export interface ContentItemVariantV3<Data>
  extends ContentItemVariantBase<Data, ContentItemV3<Data>> {}

export type ContentApiResponseV3<SchemaData = DefaultSchemaDataV3> = {
  results: ContentItemV3<ContentItemDataV3<SchemaData>>[];
};
