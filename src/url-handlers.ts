import { requestUrl } from "obsidian";

type UrlRegex = `^https?://${string}`;
type UrlHandler = (url: URL) => Promise<string | undefined>;

const specialHandlers: Record<UrlRegex, UrlHandler> = {
    // reddit posts
    ["^https?://(?:www\\.)?(?:old\\.)?reddit\\.com/r/[^/]+/comments/[^/]+/?.*"]:
        async (url: URL) => {
            const response = await requestUrl(
                url.href.replace(/(\?|$)/, ".json$1")
            );
            return response.json[0].data.children[0].data.title;
        },
    // subreddits
    ["^https?://(?:www\\.)?(?:old\\.)?reddit\\.com/r/[^/]+/?.*"]: async (
        url: URL
    ) => {
        const response = await requestUrl(
            url.href.replace(/(\?|$)/, "/about.json$1")
        );
        return response.json.data.title;
    },
};

export const getSpecialUrlHandler = (url: URL) =>
    Object.entries(specialHandlers).find(([regex]) =>
        new RegExp(regex).test(url.href)
    )?.[1];

export const defaultUrlHandler = async (url: URL) => {
    const response = await requestUrl({
        url: url.href,
        headers: {
            Accept: "text/html",
            // assume title is in first 8kb
            Range: "bytes=0-8000",
        },
    });
    if (!response.headers["content-type"].includes("text/html"))
        throw new Error(
            `Invalid content type for ${url.href}: ${response.headers["content-type"]}`
        );
    return new DOMParser().parseFromString(response.text, "text/html").title;
};
