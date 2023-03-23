import {
  rgbaToFilter,
  waitForElement,
  waitForElements,
  waitForRef,
} from '@buildquick/builder-utils';

export const useBuildquick = () => ({
  context: {
    buildquick: {
      utils: {
        rgbaToFilter,
        waitForElement,
        waitForElements,
        waitForRef,
      },
    },
  },
});

export default useBuildquick;
