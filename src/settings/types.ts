export interface PasteLinkPluginSettings {
    overridePasteHandler: boolean;
    fetchPageTitle: boolean;
    fetchPageTitleTimeout: number;
    pageTitleRegexes: string[][];
}
