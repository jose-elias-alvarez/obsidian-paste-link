import { Setting } from "obsidian";
import PasteLinkPlugin from "../main";
import { CLASS_NAMES } from "./constants";
import PasteLinkPluginSettingTab from "./setting-tab";

export default class NewRegexSetting extends Setting {
    regexes: string[] = [];
    constructor(
        plugin: PasteLinkPlugin,
        settingTab: PasteLinkPluginSettingTab,
        containerEl: HTMLElement
    ) {
        super(containerEl);
        this.addText((cb) =>
            cb
                .setPlaceholder("Page regex")
                .onChange((value) => (this.regexes[0] = value))
                .inputEl.addClass(CLASS_NAMES.regexInput)
        )
            .addText((cb) =>
                cb
                    .setPlaceholder("Title regex")
                    .onChange((value) => (this.regexes[1] = value))
                    .inputEl.addClass(CLASS_NAMES.regexInput)
            )
            .addExtraButton((cb) =>
                cb
                    .setIcon("move-up")
                    .setDisabled(true)
                    .extraSettingsEl.addClass(CLASS_NAMES.regexMoveButton)
            )
            .addExtraButton((cb) =>
                cb
                    .setIcon("move-down")
                    .setDisabled(true)
                    .extraSettingsEl.addClass(CLASS_NAMES.regexMoveButton)
            )
            .addExtraButton((cb) =>
                cb.setIcon("circle-plus").onClick(async () => {
                    if (this.regexes.every(Boolean)) {
                        plugin.settings.pageTitleRegexes.unshift([
                            this.regexes[0],
                            this.regexes[1],
                        ]);
                        await plugin.saveSettings();
                        this.regexes.length = 0;
                        settingTab.display();
                    }
                })
            );
        this.infoEl.addClass(CLASS_NAMES.regexInfoEl);
        return this;
    }
}
