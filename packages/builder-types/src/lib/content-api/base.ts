import * as CSS from 'csstype';

/* Query */

type MakeQueryType<T> = {
  '@type': '@builder.io/core:Query';
  operator: 'is';
} & T;

type BuiltInQuery =
  | MakeQueryType<{
      property: 'urlPath';
      value: string | string[];
    }>
  | MakeQueryType<{
      property: 'device' | 'host';
      value: string;
    }>;

type CustomQuery<Reference> = MakeQueryType<{
  property: string;
  value: Field<Reference>;
}>;

type Query<Reference> = BuiltInQuery | CustomQuery<Reference>;

/* Input */

type InputBase<Reference> = {
  '@type': '@builder.io/core:Field';
  advanced: boolean;
  autoFocus: boolean;
  broadcast: boolean;
  bubble: boolean;
  copyOnAdd: boolean;
  defaultValue?: Field<Reference>;
  disallowRemove: boolean;
  helperText: string;
  hidden: boolean;
  hideFromFieldsEditor: boolean;
  hideFromUI: boolean;
  mandatory: boolean;
  model: string;
  name: string;
  noPhotoPicker: boolean;
  onChange: string;
  permissionsRequiredToEdit: string;
  required: boolean;
  showIf: string;
  showTemplatePicker: boolean;
  simpleTextOnly: boolean;
  subFields: Input<Reference>[];
  type: string;
};

interface InputFile<Reference> extends InputBase<Reference> {
  allowedFileTypes: string[];
  type: 'file';
}

export type Input<Reference> = InputFile<Reference> | InputBase<Reference>;

/* Data source */

export type DataSource<Reference> = {
  dataPluginName: string;
  propertyName: string;
  resourceName: string;
  resourceId: string;
  options: {
    entry?: string;
    limit: number | null;
    omit: string;
    orderBy: string;
    orderType: string;
    query: CustomQuery<Reference>[];
    single: boolean;
  };
};

/* Schema data */

export type DefaultSchemaDataBase<Reference> = {
  [modelField: string]: Field<Reference>;
};

/* Content item */

export type ContentItemBase<Data, Variant, Reference> = {
  '@liveSyncEnabled'?: boolean;
  '@originId'?: string;
  '@originModelId'?: string;
  '@originOrgId'?: string;
  createdBy: string;
  createdDate: number;
  data: Data;
  firstPublished?: number;
  folders?: string[];
  id: string;
  lastUpdated: number;
  lastUpdatedBy: string;
  // TODO: Need to compare to CMS data model.
  meta: {
    breakpoints?: { medium: number; small: number };
    componentsUsed?: { [name: string]: number };
    hasLinks?: boolean;
    kind: 'page' | 'component' | 'data';
    lastPreviewUrl?: string;
    needsHydration?: boolean;
    originalContentId?: string;
    // TODO: When is this not null or undefined?
    winningTest?: null;
    dataSources?: DataSource<Reference>[];
  };
  modelId: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  query: Query<Reference>[];
  rev: string;
  screenshot?: string;
  testRatio: number;
  variations: {
    [contentId: string]: Variant;
  };
};

export type ContentItemVariantBase<Data, ContentItem> = Omit<
  ContentItem,
  | 'createdBy'
  | 'data'
  | 'meta'
  | 'query'
  | 'rev'
  | 'published'
  | 'firstPublished'
  | 'folders'
  | 'lastUpdated'
  | 'lastUpdatedBy'
  | 'modelId'
  | 'screenshot'
  | 'variations'
> & {
  data: Omit<Data, 'url'>;
  meta: Record<string, never>;
};

type DeviceSize = 'large' | 'medium' | 'small';

type ResponsiveStyles = {
  [Size in DeviceSize]?: {
    [Property in string & CSS.Properties]: string;
  };
};

type Action = {
  '@type': '@builder.io/core:Action';
  action: '@builder.io:customCode';
  options: {
    code: string;
  };
};

type EventActionTypes = 'click';

type EventAction = {
  '@type': '@builder.io/core:Action';
  action: '@builder.io:customCode';
  options: { code: string };
};

export interface BlockBase<Reference> {
  '@type': '@builder.io/sdk:Element';
  '@version'?: 2;
  actions?: { [EventActionType in EventActionTypes]: string };
  bindings?: {
    [binding: string | 'show' | 'hide']: string;
  };
  class?: string;
  code?: {
    actions: {
      [EventActionType in EventActionTypes]: string;
    };
  };
  id: string;
  layerName?: string;
  meta?: {
    bindingActions?: {
      component?: {
        options: {
          [option: string]: Action[];
        };
      };
    };
    eventActions?: {
      [EventActionType in EventActionTypes]: EventAction[];
    };
    previousId?: string;
  };
  properties: {
    [modelField: string]: Field<Reference>;
  };
  responsiveStyles: ResponsiveStyles;
  tagName?: string;
}

export interface BlockWithChildrenBase<Reference, Block>
  extends BlockBase<Reference> {
  children: Block[];
}

export interface BlockWithoutChildrenBase<Reference>
  extends BlockBase<Reference> {
  component: {
    name: string;
    options: Record<string, Field<Reference>>;
  };
}

export interface SymbolBase<Reference, ContentItem>
  extends BlockBase<Reference> {
  component: {
    name: string;
    options: {
      dataOnly: boolean;
      inheritState: boolean;
      renderToLiquid: boolean;
      symbol: {
        content?: ContentItem;
        // TODO: check against symbol instance with no inputs
        data: Record<string, Field<Reference>>;
        entry: string;
        model: string;
      };
    };
    id: string;
  };
}

export interface CustomComponentBase<Reference> extends BlockBase<Reference> {
  component: {
    name: string;
    options: Record<string, Field<Reference>>;
    id: string;
  };
}

export type ReferenceBase = {
  '@type': '@builder.io/core:Reference';
  id: string;
  model: string;
};

export interface ComplexField<T> {
  [key: string]: T;
}
export type Field<Reference> =
  | string
  | string[]
  | number
  | boolean
  | null
  | Reference
  | ComplexField<Field<Reference>>
  | ComplexField<Field<Reference>>[];

type Location = {
  pathname: string;
  path: string[];
  query: Record<string, string>;
};

type State<Reference> =
  | {
      deviceSize: DeviceSize;
      location: Location;
    }
  | Record<string, Field<Reference>>;

type CustomFont = {
  family: string;
  isUserFont: boolean;
};

export type ContentItemData<
  Reference,
  Block,
  SchemaData = DefaultSchemaDataBase<Reference>
> = {
  blocks?: Block[];
  cssCode?: string;
  customFonts?: CustomFont[];
  httpRequests?: {
    [key: string]: string;
  };
  inputs?: Input<Reference>[];
  jsCode?: string;
  state?: State<Reference>;
  themeId?: false | string;
  tsCode?: string;
  url: string | string[];
} & SchemaData;

export type ContentJsRef = {
  ref?: HTMLElement;
};
