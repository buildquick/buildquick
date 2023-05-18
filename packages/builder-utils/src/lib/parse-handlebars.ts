import { get } from './get';

type Filter = (value: unknown) => unknown;

const isFilter = (filter: unknown): filter is Filter =>
  typeof filter === 'function';

const filter = (
  filters: Record<string, unknown>,
  value: unknown,
  valueFilters: string[],
  match: string
): unknown => {
  if (!valueFilters.length) return value;

  const [currentValueFilter, ...remainingValueFilters] = valueFilters;
  const currentFilter = filters[currentValueFilter];

  if (!isFilter(currentFilter))
    throw `Missing or invalid filter provided in template while processing {{${match}}}: ${currentValueFilter}`;

  let newValue;

  try {
    newValue = currentFilter(value);
  } catch (e) {
    console.error(
      `Error while processing {{${match}}} in template. This filter failed: ${currentFilter}`
    );
    throw e;
  }

  return filter(filters, newValue, remainingValueFilters, match);
};

export const parseHandlebars = (
  template: string | (() => string),
  data: Record<string, unknown>,
  filters: Record<string, Filter> = {}
) => {
  // Check if the template is a string or a function
  template = typeof template === 'function' ? template() : template;
  if (['string', 'number'].indexOf(typeof template) === -1)
    throw 'Please provide a valid template';

  // If no data, return template as-is
  if (!data) return template;

  // Replace our curly braces with data
  template = template.replace(/\{\{([^}]+)\}\}/g, function (match) {
    // Remove the wrapping curly braces
    match = match.slice(2, -2);

    // Split match into object value path and filters list
    const [path, ...valueFilters] = match
      .split('|')
      .map((val) => val.trim())
      .filter((val) => val?.length > 0);

    // Get and filter the value
    const val = filter(filters, get(data, path), valueFilters, match);

    // Replace
    if (!val) return '{{' + match + '}}';
    return val.toString();
  });

  return template;
};
