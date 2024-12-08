import { Setting } from "obsidian";
import PasteLinkPlugin from "../main";
import { moveElementDown, moveElementUp } from "../utils/array";
import { CLASS_NAMES } from "./constants";
import PasteLinkPluginSettingTab from "./setting-tab";

export default class RegexSetting extends Setting {
    constructor(
        plugin: PasteLinkPlugin,
        settingTab: PasteLinkPluginSettingTab,
        containerEl: HTMLElement,
        regexes: string[],
        index: number,
    ) {
        super(containerEl);
        this.addText((cb) =>
            cb
                .setValue(regexes[0])
                .setPlaceholder("Page regex")
                .onChange(async (value) => {
                    plugin.settings.pageTitleRegexes[index][0] = value;
                    await plugin.saveSettings();
                })
                .inputEl.addClass(CLASS_NAMES.regexInput),
        )
            .addText((cb) =>
                cb
                    .setValue(regexes[1])
                    .setPlaceholder("Title regex")
                    .onChange(async (value) => {
                        plugin.settings.pageTitleRegexes[index][1] = value;
                        await plugin.saveSettings();
                    })
                    .inputEl.addClass(CLASS_NAMES.regexInput),
            )
            .addExtraButton((cb) =>
                cb
                    .setIcon("move-up")
                    .setDisabled(index === 0)
                    .onClick(async () => {
                        moveElementUp(plugin.settings.pageTitleRegexes, index);
                        await plugin.saveSettings();
                        settingTab.display();
                    })
                    .extraSettingsEl.addClass(CLASS_NAMES.regexMoveButton),
            )
            .addExtraButton((cb) =>
                cb
                    .setIcon("move-down")
                    .setDisabled(
                        index === plugin.settings.pageTitleRegexes.length - 1,
                    )
                    .onClick(async () => {
                        moveElementDown(
                            plugin.settings.pageTitleRegexes,
                            index,
                        );
                        await plugin.saveSettings();
                        settingTab.display();
                    })
                    .extraSettingsEl.addClass(CLASS_NAMES.regexMoveButton),
            )
            .addExtraButton((cb) =>
                cb
                    .setIcon("trash-2")
                    .onClick(async () => {
                        plugin.settings.pageTitleRegexes.splice(index, 1);
                        await plugin.saveSettings();
                        settingTab.display();
                    })
                    .extraSettingsEl.addClass(CLASS_NAMES.regexDeleteButton),
            );
        this.infoEl.addClass(CLASS_NAMES.regexInfoEl);
        return this;
    }
}
