import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import PasteLinkPlugin from "../main";
import RegexSetting from "./regex";
import UrlCheckSetting from "./url-check";

export default class PasteLinkPluginSettingTab extends PluginSettingTab {
    plugin: PasteLinkPlugin;

    constructor(app: App, plugin: PasteLinkPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        this.containerEl.empty();
        new Setting(this.containerEl)
            .setName("Override paste handler")
            .setDesc(
                "Override Obsidian's default paste handler so that links are automatically inserted on system paste",
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.overridePasteHandler)
                    .onChange(async (value) => {
                        this.plugin.settings.overridePasteHandler = value;
                        await this.plugin.saveSettings();
                        new Notice(
                            "Paste handler settings changed. Restart Obsidian.",
                        );
                    }),
            );

        new Setting(this.containerEl)
            .setName("Fetch page titles on paste")
            .setDesc(
                "Attempt to fetch page titles from URLs on paste when paste handler is overridden",
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.fetchPageTitle)
                    .onChange(async (value) => {
                        this.plugin.settings.fetchPageTitle = value;
                        await this.plugin.saveSettings();
                    }),
            );

        new Setting(this.containerEl)
            .setName("Fetch page timeout")
            .setDesc(
                "How many milliseconds to wait to fetch page titles before timing out",
            )
            .addText((cb) =>
                cb
                    .setValue(
                        this.plugin.settings.fetchPageTitleTimeout.toString(),
                    )
                    .onChange(async (value) => {
                        const asNumber = Number(value);
                        if (isNaN(asNumber) || asNumber < 0) return;
                        this.plugin.settings.fetchPageTitleTimeout = asNumber;
                        await this.plugin.saveSettings();
                    }),
            );

        new Setting(this.containerEl)
            .setName("Page title regexes")
            .setDesc(
                "Regular expressions used to clean page titles before pasting (see documentation)",
            )
            .setHeading();
        this.plugin.settings.pageTitleRegexes.forEach(
            (regexes, index) =>
                new RegexSetting(
                    this.plugin,
                    this,
                    this.containerEl,
                    regexes,
                    index,
                ),
        );
        new Setting(this.containerEl).addExtraButton((cb) =>
            cb.setIcon("circle-plus").onClick(async () => {
                this.plugin.settings.pageTitleRegexes.push([]);
                await this.plugin.saveSettings();
                this.display();
            }),
        );

        new UrlCheckSetting(this.plugin, this.containerEl);
    }
}
