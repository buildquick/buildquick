import { rest } from 'msw';
import { buildquickPages } from './data';

export const handlers = [
  rest.get('/api/v2/content/page', (req, res, ctx) => {
    console.log(req);
    debugger;
    return res(ctx.status(200), ctx.json({ results: buildquickPages }));
  }),
];
