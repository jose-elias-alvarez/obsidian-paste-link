import { Notice } from "obsidian";
import { defaultUrlHandler, getSpecialUrlHandler } from "./url-handlers";
import cleanTitle from "./utils/clean-title";

const tryFetchTitle = async (url: URL, regexes: string[][]) => {
    const match = regexes.find(([pageRegex]) =>
        new RegExp(pageRegex).test(url.href),
    );
    if (!match) {
        new Notice(`No matching page title regex found in settings`);
        return;
    }

    const [, regex, template] = match;
    let title: string | undefined;
    if (["http:", "https:"].includes(url.protocol)) {
        new Notice(`Attempting to fetch title from ${url.href}`);
        const handler = getSpecialUrlHandler(url);
        if (handler) {
            try {
                title = await handler(url);
            } catch (_) {
                // fall back to default on failure
            }
        }
        title ??= await defaultUrlHandler(url);
    } else {
        title = url.href;
    }
    return cleanTitle(title, regex, template);
};

export default tryFetchTitle;
