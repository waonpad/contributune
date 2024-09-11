export const getContribContainer = {
  selectors: ".js-yearly-contributions",
  exec: () => document.querySelector<HTMLDivElement>(getContribContainer.selectors),
} as const;

export const getContribMainContainer = {
  selectors: ".js-yearly-contributions > div",
  exec: () => document.querySelector<HTMLDivElement>(getContribMainContainer.selectors),
} as const;

export const getContribGraphContainer = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview",
  exec: () => document.querySelector<HTMLDivElement>(getContribGraphContainer.selectors),
} as const;

export const getContribGraphDataContainer = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url]",
  exec: () => document.querySelector<HTMLDivElement>(getContribGraphDataContainer.selectors),
} as const;

export const getContribGraphDataScrollableContainer = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url] > div",
  exec: () => document.querySelector<HTMLDivElement>(getContribGraphDataScrollableContainer.selectors),
} as const;

export const getContribGraphDataTable = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url] > div > table",
  exec: () => document.querySelector<HTMLTableElement>(getContribGraphDataTable.selectors),
} as const;

export const getContribGraphDataTableBody = {
  selectors:
    ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url] > div > table > tbody",
  exec: () => document.querySelector<HTMLTableSectionElement>(getContribGraphDataTableBody.selectors),
} as const;

export type ContribGraphLegendLevel = 0 | 1 | 2 | 3 | 4;

export const getContribGraphLegend = {
  selectors: (level: ContribGraphLegendLevel) => `#contribution-graph-legend-level-${level}` as const,
  exec: (level: ContribGraphLegendLevel) =>
    document.querySelector<HTMLDivElement>(getContribGraphLegend.selectors(level)),
} as const;
