import { ContentApiV2Item } from '@buildquick/builder-types';
import { getAll } from '@buildquick/builder-fetchers';

export const getUrlPathsFromContentItem = (content: ContentApiV2Item) => {
  if (Array.isArray(content.data.url)) return content.data.url;
  return [content.data.url];
};

export const getUrlPathsForModel = async ({
  model,
  apiKey,
}: {
  model: string;
  apiKey: string;
}) =>
  (
    await getAll({
      model,
      apiKey,
      fields: 'data.url',
      noTargeting: true,
    })
  )
    .map((content) => getUrlPathsFromContentItem(content))
    .flat();
