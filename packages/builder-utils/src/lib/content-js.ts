import { Builder } from '@builder.io/sdk';
import { ContentJsRef } from '@buildquick/builder-types';

declare const ref: ContentJsRef;

export const waitForElements = (
  selector: string,
  root: HTMLElement = document.documentElement
) => {
  return new Promise((resolve) => {
    const elements = root.querySelectorAll(selector);

    if (elements.length) {
      resolve(elements);
      return;
    }

    new MutationObserver((_mutationRecords, observer) => {
      const elements = root.querySelectorAll(selector);

      if (elements.length) {
        resolve(elements);
        observer.disconnect();
      }
    }).observe(root, {
      childList: true,
      subtree: true,
    });
  });
};

export const waitForElement = (
  selector: string,
  root: HTMLElement = document.documentElement
) => {
  return new Promise((resolve) => {
    const element = root.querySelector(selector);

    if (element) {
      resolve(element);
      return;
    }

    new MutationObserver((_mutationRecords, observer) => {
      const element = root.querySelector(selector);

      if (element) {
        resolve(element);
        observer.disconnect();
      }
    }).observe(root, {
      childList: true,
      subtree: true,
    });
  });
};

export const waitForRef = async (callback: (ref: HTMLElement) => void) => {
  if (Builder.isBrowser) {
    if (!ref.ref && !Object.getOwnPropertyDescriptor(ref, 'ref')?.get) {
      Object.defineProperty(ref, 'ref', {
        get: function () {
          return this._ref;
        },
        set: function (value) {
          this._ref = value;
          callback(value);
        },
      });
    } else if (ref.ref) {
      callback(ref.ref);
    }
  }
};
