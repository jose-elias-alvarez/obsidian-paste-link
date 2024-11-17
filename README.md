# Paste Link

Intelligently paste Markdown links.

## Usage

### Automatic

When you paste your clipboard's content into Obsidian, the plugin will check to see if it's a URL. If so, it'll insert the content as a Markdown link, using any selected text as a title. Otherwise, it'll just paste the text as normal.

### Manual

If you prefer to use a separate command, you can disable the `Override paste handler` setting, restart Obsidian, and then use the `Paste Markdown link` command, which can be bound to any key combination of your choice in Obsidian's settings.

This command inserts a link if the clipboard contains a URL and behaves like the standard `Insert Markdown link` command otherwise, so if you like, you can replace the default `Insert Markdown link` keybinding with the command provided by this plugin.

### Paste as plain text

If your clipboard contains a URL but you don't want to paste it as a Markdown link, use the `Paste URL as plain text` command, which is bound by default to Shift + Command + V on macOS / iOS and to Shift + Control + V everywhere else.

## Notes

The plugin is meant to improve on [obsidian-url-into-selection](https://github.com/denolehov/obsidian-url-into-selection) in the following ways:

-   An option to disable overriding Obsidian's paste handler
-   Separate commands to control pasting behavior
-   An option to fetch and use page titles
-   Cleaner code, which also resulted in fixing occasional bugs and edge cases

Replicating the precise behavior of obsidian-url-into-selection is not a goal, but if you have a feature request or find a bug, please open an issue.

### URLs

The plugin uses JavaScript's [URL constructor](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) to validate URLs. This means the following strings are considered URLs:

```
https://example.com
http://example.com
file:///path/to/file
```

But the following are not:

```
wwww.example.com
example.com
```

Additionally, URLs containing newlines are not handled, since Obsidian doesn't support multiline links.

### Fetch page titles

If enabled, the plugin will always attempt to fetch page titles from HTTP URLs and use them as titles when pasting links. You can also fetch page titles on demand using the `Paste link and fetch page title` command.

Note that titles from some pages (e.g. Reddit) may fail to load. The priority here is speed and predictability, not absolute correctness. If you rely heavily on this functionality, I recommend [obsidian-auto-link-title](https://github.com/zolrath/obsidian-auto-link-title).

-   You can "clean" titles by setting a regular expression in the plugin's settings. The first capture group will be used as the title.
-   To always keep the entire title, use an empty string.
-   Selected text will always be used as the title.

### Edge cases

The paste handler tries to handle these edge cases intelligently:

1. If your cursor / selection is inside of an existing link, it'll paste normally, to allow you to edit the existing link more easily.
2. If you've selected an existing link, it'll replace the link's URL with the clipboard's content, keeping its title.

These edge cases are ignored when using the `Paste Markdown link` command to better replicate the behavior of the default `Insert Markdown link` command.

I've found these behaviors useful in my own testing, but if you run into problems with your workflow, please open an issue.
