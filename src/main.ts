import {
    App,
    debounce,
    Editor,
    Notice,
    Plugin,
    PluginSettingTab,
    requestUrl,
    Setting,
} from "obsidian";
import cleanTitle from "./utils/clean-title";
import isCursorInLink from "./utils/is-cursor-in-link";
import makeLink from "./utils/make-link";
import toUrl from "./utils/to-url";

interface PasteLinkPluginSettings {
    overridePasteHandler: boolean;
    fetchPageTitle: boolean;
    pageTitleRegex: string;
}

const DEFAULT_SETTINGS: PasteLinkPluginSettings = {
    overridePasteHandler: true,
    fetchPageTitle: false,
    pageTitleRegex: "",
};

export default class PasteLinkPlugin extends Plugin {
    settings: PasteLinkPluginSettings;
    isShiftDown = false;

    onKeyDown(e: KeyboardEvent) {
        if (e.key === "Shift") this.isShiftDown = true;
    }
    onKeyUp(e: KeyboardEvent) {
        if (e.key === "Shift") this.isShiftDown = false;
    }

    insertIntoSelection(editor: Editor, link: string) {
        editor.replaceSelection(link);

        // if link title is empty, move cursor into it
        if (link.startsWith("[]")) {
            const cursor = editor.getCursor();
            cursor.ch -= link.length - 1;
            editor.setCursor(cursor);
        }
    }

    async tryFetchTitle(editor: Editor, url: URL) {
        if (!this.settings.fetchPageTitle) throw new Error();
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
        if (editor.getSelection()) throw new Error();

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
            throw new Error();
        return cleanTitle(
            new DOMParser().parseFromString(response.text, "text/html").title,
            this.settings.pageTitleRegex
        );
    }

    async handleUrl(editor: Editor, url: URL, content: string) {
        let title: string;
        try {
            title = await this.tryFetchTitle(editor, url);
        } catch (_) {
            title = editor.getSelection();
        }
        this.insertIntoSelection(editor, makeLink(title, content));
    }

    onPaste(e: ClipboardEvent, editor: Editor) {
        if (e.defaultPrevented) return;
        if (this.isShiftDown) return;

        const content = e.clipboardData?.getData("text/plain") ?? "";
        const url = toUrl(content);
        if (!url) return;

        const cursor = editor.getCursor();
        const line = editor.getLine(cursor.line);
        if (isCursorInLink(cursor, line)) return;

        e.preventDefault();
        this.handleUrl(editor, url, content);
    }

    async onCommand(editor: Editor) {
        const content = await navigator.clipboard.readText();
        const url = toUrl(content);
        if (!url) {
            // @ts-ignore
            this.app.commands.executeCommandById("editor:insert-link");
            return;
        }
        await this.handleUrl(editor, url, content);
    }

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new SettingTab(this.app, this));

        if (this.settings.overridePasteHandler) {
            this.registerDomEvent(document, "keyup", this.onKeyUp.bind(this));
            this.registerDomEvent(
                document,
                "keydown",
                this.onKeyDown.bind(this)
            );
            this.registerEvent(
                this.app.workspace.on("editor-paste", this.onPaste.bind(this))
            );
        }

        this.addCommand({
            id: "paste-link",
            name: "Paste Markdown link",
            editorCallback: this.onCommand.bind(this),
        });
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class SettingTab extends PluginSettingTab {
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
                "Overrides Obsidian's default paste handler so that links are automatically inserted on system paste"
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
            .setName("Fetch page titles")
            .setDesc("Attempts to fetch page titles from HTTP URLs")
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
