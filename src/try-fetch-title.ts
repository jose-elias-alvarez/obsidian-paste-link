import { Notice } from "obsidian";
import { defaultUrlHandler, getSpecialUrlHandler } from "./url-handlers";
import cleanTitle from "./utils/clean-title";

const tryFetchTitle = async (url: URL, regexes: string[][]) => {
    if (!["http:", "https:"].includes(url.protocol)) return;
    new Notice(`Attempting to fetch title from ${url.href}`);

    let title: string | undefined;
    const handler = getSpecialUrlHandler(url);
    if (handler) {
        try {
            title = await handler(url);
        } catch (_) {
            // fall back to default on failure
        }
    }
    title ??= await defaultUrlHandler(url);

    const regex =
        regexes.find(([pageRegex]) =>
            new RegExp(pageRegex).test(url.href),
        )?.[1] || "";
    return cleanTitle(title, regex);
};

export default tryFetchTitle;
