import {
  waitForElement,
  waitForElements,
  waitForRef,
} from '@buildquick/builder-utils';

export const useBuildquick = () => ({
  context: {
    buildquick: {
      utils: {
        waitForElement,
        waitForElements,
        waitForRef,
      },
    },
  },
});

export default useBuildquick;
