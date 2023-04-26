import {
  parseHandlebars,
  rgbaToFilter,
  waitForElement,
  waitForElements,
  waitForRef,
} from '@buildquick/builder-utils';

export const useBuildQuick = () => ({
  context: {
    buildQuick: {
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

export default useBuildQuick;
