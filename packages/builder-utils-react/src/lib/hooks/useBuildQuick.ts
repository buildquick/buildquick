import {
  parseHandlebars,
  rgbaToFilter,
  waitForElement,
  waitForElements,
  waitForRefElement,
} from '@buildquick/builder-utils';

export const useBuildQuick = () => ({
  context: {
    buildQuick: {
      utils: {
        parseHandlebars,
        rgbaToFilter,
        waitForElement,
        waitForElements,
        waitForRefElement,
      },
    },
  },
});

export default useBuildQuick;
