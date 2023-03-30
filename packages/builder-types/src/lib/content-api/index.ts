import { DefaultSchemaDataType } from './base';
import { BlockV1, ContentItemV1, ReferenceV1 } from './v1';
import { BlockV2, ContentItemV2, ReferenceV2 } from './v2';
import { BlockV3, ContentItemV3, ReferenceV3 } from './v3';

export type Block = BlockV1 | BlockV2 | BlockV3;
export type Reference = ReferenceV1 | ReferenceV2 | ReferenceV3;
export type ContentItem<SchemaData = DefaultSchemaDataType<Reference, Block>> =
  | ContentItemV1<SchemaData>
  | ContentItemV2<SchemaData>
  | ContentItemV3<SchemaData>;
