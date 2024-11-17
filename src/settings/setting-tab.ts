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
            .setName("Always fetch page titles")
            .setDesc("Always attempt to fetch page titles from HTTP URLs")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.fetchPageTitle)
                    .onChange(async (value) => {
                        this.plugin.settings.fetchPageTitle = value;
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
                                this.plugin.settings.pageTitleRegex =
                                    new RegExp(value).source;
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
