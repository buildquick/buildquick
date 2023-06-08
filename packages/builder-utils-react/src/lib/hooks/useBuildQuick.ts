import {
  parseHandlebars,
  rgbaToFilter,
  waitForElement,
  waitForElements,
  getComponentElement,
} from '@buildquick/builder-utils';

export const useBuildQuick = () => ({
  context: {
    buildQuick: {
      utils: {
        parseHandlebars,
        rgbaToFilter,
        waitForElement,
        waitForElements,
        getComponentElement,
      },
    },
  },
});

export default useBuildQuick;
