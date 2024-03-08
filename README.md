# Paste Link

Intelligently paste Markdown links.

## Usage

### Automatic

When you paste your clipboard's content into Obsidian, the plugin will check to see if it's a URL. If so, it'll insert the content as a Markdown link, using any selected text as a title. Otherwise, it'll just paste the text as normal.

Holding `Shift` while pasting will also force a standard paste, regardless of the clipboard's content.

### Manual

If you prefer to use a separate command / keyboard shortcut, you can disable the `Override paste handler` setting, restart Obsidian, and then use the `Paste Link: Paste Markdown link` command.

This command inserts a link if the clipboard contains a URL and behaves like the standard `Insert Markdown link` command otherwise, so you can replace the default `Insert Markdown link` keybinding with the command provided by this plugin, if you like.

## Notes

The plugin is meant to improve on [obsidian-url-into-selection](https://github.com/denolehov/obsidian-url-into-selection) in the following ways:

-   A hotkey (Shift) to paste a link as plain text
-   An option to disable overriding the paste handler and use a dedicated command instead
-   Cleaner code, which also resulted in fixing occasional bugs and edge cases

Replicating the precise behavior of that plugin is not a goal, but if you have a feature request or find a bug, please open an issue.

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

### Edge cases

The paste handler tries to handle these edge cases intelligently:

1. If your cursor / selection is inside of an existing link, it'll paste normally, to allow you to edit the existing link more easily.
2. If you've selected an existing link, it'll replace the link's URL with the clipboard's content, keeping its title.

These edge cases are ignored when using the `Paste Markdown link` command to better replicate the behavior of the default `Insert Markdown link` command.

I've found these behaviors useful in my own testing, but if you run into problems with your workflow, please open an issue.
