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

export const getComponentElement = (
  component: any
): Promise<{ element: HTMLElement; ref: any }> => {
  return new Promise((resolve) => {
    if (component) {
      if (
        !component.ref &&
        !Object.getOwnPropertyDescriptor(component, 'ref')?.get
      ) {
        Object.defineProperty(component, 'ref', {
          get: function () {
            return this._ref;
          },
          set: function (element) {
            this._ref = element;
            resolve({ element, ref: this });
          },
        });
      } else if (component.ref) {
        resolve({ element: component.ref, ref: this });
      }
    } else {
      console.error(
        `getComponentElement requires a component. Recieved: ${component}`
      );
    }
  });
};
