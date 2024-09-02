export const getGitHubYearlyContributionsContainer = {
  selectors: ".js-yearly-contributions",
  node: () => document,
  exec: () =>
    getGitHubYearlyContributionsContainer
      .node()
      .querySelector<HTMLDivElement>(getGitHubYearlyContributionsContainer.selectors),
} as const;

export const getGitHubYearlyContributionsMainContainer = {
  selectors: ".js-yearly-contributions > div",
  node: () => document,
  exec: () =>
    getGitHubYearlyContributionsMainContainer
      .node()
      .querySelector<HTMLDivElement>(getGitHubYearlyContributionsMainContainer.selectors),
} as const;

export const getGitHubYearlyContributionsGraphContainer = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview",
  node: () => document,
  exec: () =>
    getGitHubYearlyContributionsGraphContainer
      .node()
      .querySelector<HTMLDivElement>(getGitHubYearlyContributionsGraphContainer.selectors),
} as const;

export const getGitHubYearlyContributionsGraphDataContainer = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url]",
  node: () => document,
  exec: () =>
    getGitHubYearlyContributionsGraphDataContainer
      .node()
      .querySelector<HTMLDivElement>(getGitHubYearlyContributionsGraphDataContainer.selectors),
} as const;

export const getGitHubYearlyContributionsGraphDataScrollableContainer = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url] > div",
  node: () => document,
  exec: () =>
    getGitHubYearlyContributionsGraphDataScrollableContainer
      .node()
      .querySelector<HTMLDivElement>(getGitHubYearlyContributionsGraphDataScrollableContainer.selectors),
} as const;

export const getGitHubYearlyContributionsGraphDataTable = {
  selectors: ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url] > div > table",
  node: () => document,
  exec: () =>
    getGitHubYearlyContributionsGraphDataTable
      .node()
      .querySelector<HTMLTableElement>(getGitHubYearlyContributionsGraphDataTable.selectors),
} as const;

export const getGitHubYearlyContributionsGraphDataTableBody = {
  selectors:
    ".js-yearly-contributions > div > .graph-before-activity-overview > div[data-graph-url] > div > table > tbody",
  node: () => document,
  exec: () =>
    getGitHubYearlyContributionsGraphDataTableBody
      .node()
      .querySelector<HTMLTableSectionElement>(getGitHubYearlyContributionsGraphDataTableBody.selectors),
} as const;
