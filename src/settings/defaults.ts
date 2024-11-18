import { PasteLinkPluginSettings } from "./types";

export const DEFAULT_SETTINGS: PasteLinkPluginSettings = {
    overridePasteHandler: true,
    fetchPageTitle: false,
    fetchPageTitleTimeout: 5000,
    pageTitleRegex: "",
};
