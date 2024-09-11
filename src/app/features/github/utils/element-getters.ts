export const getContribContainer = {
  selectors: ".js-yearly-contributions",
  node: () => document,
  exec: () => getContribContainer.node().querySelector<HTMLDivElement>(getContribContainer.selectors),
} as const;

export const getContribMainContainer = {
  selectors: ".js-yearly-contributions > div",
  node: () => document,
  exec: () => getContribMainContainer.node().querySelector<HTMLDivElement>(getContribMainContainer.selectors),
} as const;

export const getContribGraphContainer = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview",
  node: () => document,
  exec: () => getContribGraphContainer.node().querySelector<HTMLDivElement>(getContribGraphContainer.selectors),
} as const;

export const getContribGraphDataContainer = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url]",
  node: () => document,
  exec: () => getContribGraphDataContainer.node().querySelector<HTMLDivElement>(getContribGraphDataContainer.selectors),
} as const;

export const getContribGraphDataScrollableContainer = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url] > div",
  node: () => document,
  exec: () =>
    getContribGraphDataScrollableContainer
      .node()
      .querySelector<HTMLDivElement>(getContribGraphDataScrollableContainer.selectors),
} as const;

export const getContribGraphDataTable = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url] > div > table",
  node: () => document,
  exec: () => getContribGraphDataTable.node().querySelector<HTMLTableElement>(getContribGraphDataTable.selectors),
} as const;

export const getContribGraphDataTableBody = {
  selectors:
    ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url] > div > table > tbody",
  node: () => document,
  exec: () =>
    getContribGraphDataTableBody.node().querySelector<HTMLTableSectionElement>(getContribGraphDataTableBody.selectors),
} as const;

export type ContribGraphLegendLevel = 0 | 1 | 2 | 3 | 4;

export const getContribGraphLegend = {
  selectors: (level: ContribGraphLegendLevel) => `#contribution-graph-legend-level-${level}` as const,
  node: () => document,
  exec: (level: ContribGraphLegendLevel) =>
    getContribGraphLegend.node().querySelector<HTMLDivElement>(getContribGraphLegend.selectors(level)),
} as const;
