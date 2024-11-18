import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import PasteLinkPlugin from "../main";
import NewRegexSetting from "./new-regex";
import RegexSetting from "./regex";

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
                "Override Obsidian's default paste handler so that links are automatically inserted on system paste"
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.overridePasteHandler)
                    .onChange(async (value) => {
                        this.plugin.settings.overridePasteHandler = value;
                        await this.plugin.saveSettings();
                        new Notice(
                            "Paste handler settings changed. Restart Obsidian."
                        );
                    })
            );

        new Setting(this.containerEl)
            .setName("Fetch page titles on paste")
            .setDesc(
                "Attempt to fetch page titles from HTTP URLs on paste when paste handler is overridden"
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.fetchPageTitle)
                    .onChange(async (value) => {
                        this.plugin.settings.fetchPageTitle = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(this.containerEl)
            .setName("Page title regexes")
            .setDesc(
                "Regular expressions used to clean page titles before pasting (see documentation)"
            )
            .setHeading();
        this.plugin.settings.pageTitleRegexes.forEach(
            (regexes, index) =>
                new RegexSetting(
                    this.plugin,
                    this,
                    this.containerEl,
                    regexes,
                    index
                )
        );
        new NewRegexSetting(this.plugin, this, this.containerEl);
    }
}
