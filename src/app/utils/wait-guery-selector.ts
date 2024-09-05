export const waitQuerySelectorAll = async <T extends Element>(
  selector: string,
  node: Document | Element = document,
): Promise<NodeListOf<T>> => {
  let nodeList: NodeListOf<T> | null = null;

  while (!nodeList || (nodeList as NodeListOf<T>).length === 0) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        nodeList = node.querySelectorAll<T>(selector);
        resolve();
      }, 100);
    });
  }

  return nodeList;
};

export const waitQuerySelector = async <T extends Element>(
  selector: string,
  node: Document | Element = document,
): Promise<T> => {
  let element: T | null = null;

  while (!element) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        element = node.querySelector<T>(selector);
        resolve();
      }, 100);
    });
  }

  return element as T;
};
