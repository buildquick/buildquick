export const parseHandlebars = (
  template: string,
  data: Record<string, string>
) => {
  const regex = /{{\s*(\w+)\s*}}/g;
  let parsedTemplate = template;

  let match;
  while ((match = regex.exec(template)) !== null) {
    const variableName = match[1];
    const value = data[variableName];

    if (value !== undefined) {
      parsedTemplate = parsedTemplate.replace(match[0], value);
    } else {
      console.warn(`Variable "${variableName}" not found in data object.`);
    }
  }

  return parsedTemplate;
};
