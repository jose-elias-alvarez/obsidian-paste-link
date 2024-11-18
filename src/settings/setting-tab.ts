import { App, Notice, PluginSettingTab, Setting, debounce } from "obsidian";
import PasteLinkPlugin from "../main";

export default class PasteLinkPluginSettingTab extends PluginSettingTab {
    plugin: PasteLinkPlugin;

    constructor(app: App, plugin: PasteLinkPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
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

        new Setting(containerEl)
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

        new Setting(containerEl)
            .setName("Fetch page timeout")
            .setDesc(
                "How many milliseconds to wait to fetch page titles before timing out"
            )
            .addText((cb) =>
                cb
                    .setValue(
                        this.plugin.settings.fetchPageTitleTimeout.toString()
                    )
                    .onChange(async (value) => {
                        const asNumber = Number(value);
                        if (isNaN(asNumber) || asNumber < 0) return;
                        this.plugin.settings.fetchPageTitleTimeout = asNumber;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName("Page title regex")
            .setDesc(
                "Regular expression used to clean page titles before pasting (see documentation)"
            )
            .addText((text) =>
                text.setValue(this.plugin.settings.pageTitleRegex).onChange(
                    debounce(
                        async (value) => {
                            try {
                                this.plugin.settings.pageTitleRegex = value
                                    ? new RegExp(value).source
                                    : value;
                            } catch (_) {
                                new Notice(`Failed to parse regex: ${value}`);
                                return;
                            }

                            await this.plugin.saveSettings();
                        },
                        200,
                        true
                    )
                )
            );
    }
}
