export const getContribsContainer = {
  selectors: ".js-yearly-contributions",
  node: () => document,
  exec: () => getContribsContainer.node().querySelector<HTMLDivElement>(getContribsContainer.selectors),
} as const;

export const getContribsMainContainer = {
  selectors: ".js-yearly-contributions > div",
  node: () => document,
  exec: () => getContribsMainContainer.node().querySelector<HTMLDivElement>(getContribsMainContainer.selectors),
} as const;

export const getContribsGraphContainer = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview",
  node: () => document,
  exec: () => getContribsGraphContainer.node().querySelector<HTMLDivElement>(getContribsGraphContainer.selectors),
} as const;

export const getContribsGraphDataContainer = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url]",
  node: () => document,
  exec: () =>
    getContribsGraphDataContainer.node().querySelector<HTMLDivElement>(getContribsGraphDataContainer.selectors),
} as const;

export const getContribsGraphDataScrollableContainer = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url] > div",
  node: () => document,
  exec: () =>
    getContribsGraphDataScrollableContainer
      .node()
      .querySelector<HTMLDivElement>(getContribsGraphDataScrollableContainer.selectors),
} as const;

export const getContribsGraphDataTable = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url] > div > table",
  node: () => document,
  exec: () => getContribsGraphDataTable.node().querySelector<HTMLTableElement>(getContribsGraphDataTable.selectors),
} as const;

export const getContribsGraphDataTableBody = {
  selectors:
    ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url] > div > table > tbody",
  node: () => document,
  exec: () =>
    getContribsGraphDataTableBody
      .node()
      .querySelector<HTMLTableSectionElement>(getContribsGraphDataTableBody.selectors),
} as const;

export type ContribsGraphLegendLevel = 0 | 1 | 2 | 3 | 4;

export const getContribsGraphLegend = {
  selectors: (level: ContribsGraphLegendLevel) => `#contribution-graph-legend-level-${level}` as const,
  node: () => document,
  exec: (level: ContribsGraphLegendLevel) =>
    getContribsGraphLegend.node().querySelector<HTMLDivElement>(getContribsGraphLegend.selectors(level)),
} as const;
