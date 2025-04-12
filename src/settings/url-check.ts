import { Setting } from "obsidian";
import PasteLinkPlugin from "../main";
import tryFetchTitle from "../try-fetch-title";
import toUrl from "../utils/to-url";

export default class UrlCheckSetting extends Setting {
    urlEl: HTMLParagraphElement;
    titleEl: HTMLParagraphElement;

    _url = "";
    get url() {
        return this._url;
    }
    set url(url: string) {
        this._url = url;
        this.urlEl.innerHTML = `URL: ${url || "empty"}`;
    }

    set title(title: string) {
        this.titleEl.innerHTML = `Title: ${title || "empty"}`;
    }

    constructor(plugin: PasteLinkPlugin, containerEl: HTMLElement) {
        super(containerEl);
        this.urlEl = containerEl.createEl("p");
        this.titleEl = containerEl.createEl("p");
        this.url = "";
        this.title = "";

        this.setName("Check URL")
            .setHeading()
            .setDesc(
                "Check the provided URL against the configured page title regexes",
            )
            .addText((text) =>
                text
                    .setPlaceholder("URL")
                    // don't display url until submit
                    .onChange((value) => (this._url = value)),
            )
            .addButton((button) =>
                button
                    .setButtonText("Check")
                    .setCta()
                    .onClick(async () => {
                        if (!this.url) {
                            this.url = "";
                            this.title = "";
                            return;
                        }

                        const url = toUrl(this.url);
                        if (!url) {
                            this.url = "invalid";
                            this.title = "";
                            return;
                        }

                        this.url = url.href;
                        const title = await tryFetchTitle(
                            url,
                            plugin.settings.pageTitleRegexes,
                        );
                        this.title = title || "";
                    }),
            );
    }
}
