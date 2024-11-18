import { Notice, requestUrl } from "obsidian";
import cleanTitle from "./utils/clean-title";

const tryFetchTitle = async (url: URL, regexes: string[][]) => {
    if (!["http:", "https:"].includes(url.protocol)) return;

    new Notice(`Attempting to fetch title from ${url.href}`);
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
    const regex =
        regexes.find(([pageRegex]) =>
            new RegExp(pageRegex).test(url.href)
        )?.[1] || "";
    return cleanTitle(
        new DOMParser().parseFromString(response.text, "text/html").title,
        regex
    );
};

export default tryFetchTitle;
