import { Editor, Notice, Platform, Plugin } from "obsidian";
import { DEFAULT_SETTINGS } from "./settings/defaults";
import PasteLinkPluginSettingTab from "./settings/setting-tab";
import { PasteLinkPluginSettings } from "./settings/types";
import tryFetchTitle from "./try-fetch-title";
import isCursorInLink from "./utils/is-cursor-in-link";
import makeLink from "./utils/make-link";
import toUrl from "./utils/to-url";

export default class PasteLinkPlugin extends Plugin {
    settings: PasteLinkPluginSettings;

    insertIntoSelection(editor: Editor, link: string) {
        editor.replaceSelection(link);
        // if link title is empty, move cursor into it
        if (link.startsWith("[]")) {
            const cursor = editor.getCursor();
            cursor.ch -= link.length - 1;
            editor.setCursor(cursor);
        }
    }

    async handleUrl(
        editor: Editor,
        url: URL,
        content: string,
        fetchPageTitle = this.settings.fetchPageTitle
    ) {
        let title: string | undefined;
        if (fetchPageTitle && !editor.getSelection()) {
            try {
                title = await tryFetchTitle(url, this.settings.pageTitleRegex);
            } catch (error) {
                console.error(
                    `Failed to fetch page title for ${url.href}: ${error}`
                );
            }
        }
        title ??= editor.getSelection();
        this.insertIntoSelection(editor, makeLink(title, content));
    }

    onPaste(e: ClipboardEvent, editor: Editor) {
        if (e.defaultPrevented) return;

        const content = e.clipboardData?.getData("text/plain") ?? "";
        const url = toUrl(content);
        if (!url) return;

        const cursor = editor.getCursor();
        const line = editor.getLine(cursor.line);
        if (isCursorInLink(cursor, line)) return;

        e.preventDefault();
        this.handleUrl(editor, url, content);
    }

    // commands
    async pasteLink(editor: Editor) {
        const content = await navigator.clipboard.readText();
        const url = toUrl(content);
        if (!url) {
            // @ts-ignore
            this.app.commands.executeCommandById("editor:insert-link");
            return;
        }
        await this.handleUrl(editor, url, content);
    }

    async pasteLinkAndFetchTitle(editor: Editor) {
        const content = await navigator.clipboard.readText();
        const url = toUrl(content);
        if (!url) {
            new Notice(
                `Failed to convert clipboard content to URL: ${content}`
            );
            return;
        }
        await this.handleUrl(editor, url, content, true);
    }

    async pasteAsPlainText(editor: Editor) {
        const content = await navigator.clipboard.readText();
        editor.replaceSelection(content);
    }

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new PasteLinkPluginSettingTab(this.app, this));

        if (this.settings.overridePasteHandler) {
            this.registerEvent(
                this.app.workspace.on("editor-paste", this.onPaste.bind(this))
            );
        }

        this.addCommand({
            id: "paste-link",
            name: "Paste Markdown link",
            editorCallback: this.pasteLink.bind(this),
        });
        this.addCommand({
            id: "paste-as-plain-text",
            name: "Paste URL as plain text",
            editorCallback: this.pasteAsPlainText.bind(this),
            // set default hotkey for backwards compatibility w/ v1
            hotkeys: [
                {
                    key: "v",
                    modifiers: [
                        "Shift",
                        Platform.isMacOS || Platform.isIosApp ? "Meta" : "Ctrl",
                    ],
                },
            ],
        });
        this.addCommand({
            id: "paste-link-and-fetch-title",
            name: "Paste link and fetch page title",
            editorCallback: this.pasteLinkAndFetchTitle.bind(this),
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
