import { Notice, requestUrl } from "obsidian";
import cleanTitle from "./utils/clean-title";

const tryFetchTitle = async (url: URL, regex: string) => {
    if (!["http:", "https:"].includes(url.protocol)) return;

    new Notice(`Fetching title from ${url.href}`);
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
            `Received invalid content type from URL ${url.href}: ${response.headers["content-type"]}`
        );
    return cleanTitle(
        new DOMParser().parseFromString(response.text, "text/html").title,
        regex
    );
};

export default tryFetchTitle;
