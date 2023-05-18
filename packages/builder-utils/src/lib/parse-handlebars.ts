import { get } from './get';

export const parseHandlebars = (
  template: string | (() => string),
  data: Record<string, string>
) => {
  // Check if the template is a string or a function
  template = typeof template === 'function' ? template() : template;
  if (['string', 'number'].indexOf(typeof template) === -1)
    throw 'PlaceholdersJS: please provide a valid template';

  // If no data, return template as-is
  if (!data) return template;

  // Replace our curly braces with data
  template = template.replace(/\{\{([^}]+)\}\}/g, function (match) {
    // Remove the wrapping curly braces
    match = match.slice(2, -2);

    // Get the value
    const val = get(data, match.trim());

    // Replace
    if (!val) return '{{' + match + '}}';
    return val;
  });

  return template;
};
