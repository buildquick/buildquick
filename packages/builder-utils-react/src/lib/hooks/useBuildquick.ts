import {
  parseHandlebars,
  rgbaToFilter,
  waitForElement,
  waitForElements,
  waitForRef,
} from '@buildquick/builder-utils';

export const useBuildquick = () => ({
  context: {
    buildquick: {
      utils: {
        parseHandlebars,
        rgbaToFilter,
        waitForElement,
        waitForElements,
        waitForRef,
      },
    },
  },
});

export default useBuildquick;
