# builder-utils

Various utilities for working with Builder content.

## Installation

`npm install @buildquick/builder-utils`

## Usage

### getOne/getSome

Fetchers for getting content from the content API that use `fetch` internally instead of `@builder/core`'s `builder.get`, which leads to more predictable and consistent results across editing, previewing, and published environments.

Supports:

- Retries with [exponential backoff and jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- Builder [private API keys](https://www.builder.io/c/docs/using-your-api-key#managing-private-keys)
- Custom content API URL
- Custom fetch options
- `@buildquick/builder-types` for accurate and comprehensive TypeScript typings

`getOne` returns the first content item matching your query.

`getSome` returns the all content items matching your query, up to the `limit` (default is `100`, Builder API's max is also `100`).

```js
import { getOne, getSome } from '@buildquick/builder-utils'

const query = {
  model: "your-model",
  apiKey: YOUR_BUILDER_PUBLIC_API_KEY,
  // Add your Builder content API query options.
  userAttributes: { url: '/home' },
  noTraverse: false,
  // Optional: access private models.
  authToken: YOUR_BUILDER_PRIVATE_TOKEN,
  // Optional: override the maximum backoff value in ms (defaults to 32000).
  maxBackoff: 5000,
  // Optional: override the maximum number of fetch attempts (defaults to 6).
  maxTries: 2,
  // Optional: override the default content API URL. Supports async.
  // Useful when proxying the content API.
  getContentApiUrl: async ({ model, queryString, query, authToken }) => `${await getBuilderProxyUrl(environment)}/${model}?${queryString}`,
  // Optional: pass options to the underlying fetch.
  // Especially helpful when using getContentApiUrl.
  fetchOptions: {
    method: 'POST',
    headers: {
      Authorization: 'Some Non-Standard Auth ...'
    }
  }
}

const getOneSomeOptions = {
  // Optional: transform the raw JSON returned from fetch.
  // For getOne, return just one content item.
  // For getSome, return an array of content items.
  transform: ({ data }) => modifyYourContent(data.results)
}

// Returns the first matching content item.
await getOne({ ...query, ...getOneSomeOptions }) // { id: ..., data: { ... }, ... }
// Returns the first page of content items that match your query.
await getSome({ ...query, ...getOneSomeOptions }) // [{ id: ..., data: { ... }, ... }, ...]
```

### getAll

Like `getOne`/`getSome`, but automatically paginates over an entire Builder model to return all of the content items for that model that match your query.

```js
const getAllOptions = {
  // Optional: override the maximum number of results per page (defaults to 100).
  pageLimit: 50,
  // Optional: transform each page's raw JSON returend from fetch.
  // Return the page as an array of content items.
  pageTransform: ({ data, pageIndex, offset, limit }) => modifyYourPage(data.results)
}

await getAll({ ...query, ...getAllOptions }) // [{ id: ..., data: { ... }, ... }, ...] 
```

### rgbaToFilter

Converts rgba values to CSS `filter` rules.

Use case: when you want to dynamically set a color on an SVG inside of an Image block since the SVG is rendered as an `<img>` tag, which [doesn't understand SVG's `currentColor`](https://github.com/WICG/proposals/issues/50).

You can use `filter` [to get around this well-known limitation](https://medium.com/@union_io/swapping-fill-color-on-image-tag-svgs-using-css-filters-fa4818bf7ec6), and this utility creates a filter that closely approximates the color that you pass to it.

```js
import { rgbaToFilter } from '@buildquick/builder-utils'

// Pass rgbaToFilter to Builder content using context.
// Using the React SDK, for example:

<BuilderComponent model="your-model" context={{ rgbaToFilter }} />

// In your element data bindings in the Visual Editor's Data tab,
// create a binding for style.filter (this example assumes that you
// have a content input named "color" with an rgb or rgba string):
context.rgbaToFilter(state.color)
```

### parseHandlebars

A lightweight handlebars template processor for interpolating variables into text.

Use case: when you want to offer users a way to add dynamic variables to a Text block. Unlike Handlebars.js, this is a simple function that only supports interpolating basic strings into the text, which covers most use cases.

```js
import { parseHandlebars } from '@buildquick/builder-utils'

// Pass parseHandlebars to Builder content using context.
// Using the React SDK, for example:

<BuilderComponent model="your-model" context={{ parseHandlebars }} />

// In your element data bindings in the Visual Editor's Data tab,
// create a binding for your Text block's Text (this example assumes
// that you have a content inputs for an address):
context.parseHandlebars(state.text, {
  address1: state.address1,
  address2: state.address2,
  city: state.city,
  state: state.state,
  postalCode: state.postalCode
})
```

### waitForRef

Waits for `ref.ref`, the DOM node that your Builder content is rendered into, to become available.

Use case: an advanced use case for Builder content JS is to manipulate content through its DOM nodes. However, when rendering lots of Builder content on a page, the browser sometimes executes content JS before the DOM nodes for the content have rendered, meaning that calls to `document.querySelector`/`document.querySelectorAll` will fail.

By waiting for the content's ref to become available, you can guarantee that the DOM nodes for your content item have been created and that you can query them successfully.

```js
import { waitForRef } from '@buildquick/builder-utils'

// Pass waitForRef to Builder content using context.
// Using the React SDK, for example:

<BuilderComponent model="your-model" context={{ parseHandlebars }} />

// In your content JS:

if (Builder.isBrowser) {
  context.waitForRef((ref) => {
    // ...some DOM manipulation of your content...
  })
}
```

### waitForElement/waitForElements

Given a CSS selector, `waitForElement`/`waitForElements` monitor the document and respectively return the selected element or elements once they appear on the page.

You can also pass a DOM node as an optional root parameter, in which case `waitForElement`/`waitForElements` will scope your selector to the given element.

Use case: as with `waitForRef`, you may occasionally want to directly manipulate a content item's DOM nodes, but naively calling `document.querySelector`/`document.querySelectorAll` may fail on pages with lots of content.

You can use `waitforElement`/`waitForElements` to ensure that the required DOM nodes are available before operating on them.

```js
import { waitForRef } from '@buildquick/builder-utils'

// Pass waitForRef to Builder content using context.
// Using the React SDK, for example:

<BuilderComponent model="your-model" context={{ parseHandlebars }} />

// In your content JS:

if (Builder.isBrowser) {
  // Finds the first instance of 'my-content' that renders on the page...
  doSomething(await context.waitForElement('.my-content'));

  // ...or, scope your query to your current content item.
  context.waitForRef(async (ref) => {
    doSomething(await context.waitForElement('.my-content', ref));
  })
}
```