import {
    App,
    Editor,
    Notice,
    Plugin,
    PluginSettingTab,
    Setting,
} from "obsidian";
import isCursorInLink from "./utils/is-cursor-in-link";
import isUrl from "./utils/is-url";
import makeLink from "./utils/make-link";

interface PasteLinkPluginSettings {
    overridePasteHandler: boolean;
}

const DEFAULT_SETTINGS: PasteLinkPluginSettings = {
    overridePasteHandler: true,
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

    insertIntoSelection(editor: Editor, content: string) {
        const selection = editor.getSelection();
        const link = makeLink(selection, content);
        editor.replaceSelection(link);

        // if link title is empty, move cursor into it
        if (link.startsWith("[]")) {
            const cursor = editor.getCursor();
            cursor.ch -= link.length - 1;
            editor.setCursor(cursor);
        }
    }

    onPaste(e: ClipboardEvent, editor: Editor) {
        if (e.defaultPrevented) return;
        if (this.isShiftDown) return;

        const clipboardContent = e.clipboardData?.getData("text/plain") ?? "";
        if (!isUrl(clipboardContent)) return;

        const cursor = editor.getCursor();
        const line = editor.getLine(cursor.line);
        if (isCursorInLink(cursor, line)) return;

        e.preventDefault();
        this.insertIntoSelection(editor, clipboardContent);
    }

    async onCommand(editor: Editor) {
        const content = await navigator.clipboard.readText();
        if (!isUrl(content)) {
            // @ts-ignore
            this.app.commands.executeCommandById("editor:insert-link");
            return;
        }
        this.insertIntoSelection(editor, content);
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
    }
}
