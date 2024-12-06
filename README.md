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

The plugin was originally inspired by [obsidian-url-into-selection](https://github.com/denolehov/obsidian-url-into-selection) and seeks to improve on it in the following ways:

-   An option to disable overriding Obsidian's paste handler
-   Separate commands to control pasting behavior
-   Cleaner code, which also resulted in fixing occasional bugs and edge cases

The ability to fetch page titles was inspired by [obsidian-auto-link-title](https://github.com/zolrath/obsidian-auto-link-title) and incorporates the following improvements:

-   Using `fetch()` vs. an Electron window to get page titles, which is faster and more predictable
-   Page-specific handlers for sites that don't normally expose titles (e.g. Reddit)
-   An option to "clean" page titles using page-specific regular expressions

100% feature parity with these plugins is not a goal, but if you have a feature request or find a bug, please open an issue.

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

If the `Fetch page titles on paste` setting is enabled, the plugin will attempt to fetch page titles from HTTP URLs and use them as titles when `Override paste handler` is enabled. Alternatively, you can also fetch page titles on demand using the `Paste link and fetch page title` command.

Note that some pages (e.g. SPAs) may not include the full title in their HTML. Exceptions are handled on a best-case basis, and contributions to add new handlers are very welcome.

#### Page title regexes

You can optionally "clean" page titles using regular expressions, which are configured in the plugin's settings. Each entry there consists of two regular expressions:

1. A page regex, which is matched against the page's full URL.
2. A title regex, which is matched against the page's fetched title. The value of the first capture group is treated as the title.

Regexes are matched top to bottom, so you can set values for specific sites as well as fallbacks. If no match is found, the plugin will use the full page title.

Note that regexes are parsed using the [Javascript RegExp() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp). Use [regex101](https://regex101.com) for validation. (If you're not good with regular expressions, ask ChatGPT.)

A few examples from my configuration:

| Page regex                                    | Title regex               | Original                                                           | Cleaned                   |
| --------------------------------------------- | ------------------------- | ------------------------------------------------------------------ | ------------------------- |
| `^https?://(?:www\\.)?github\\.com/.+?/issue` | `^(.+?)·`                 | Add dark mode support · Issue #123 · raycast/extensions            | Add dark mode support     |
| `^https?://(?:www\\.)?github\\.com`           | `GitHub\\s*-\\s*([^:]+)`  | GitHub - raycast/extensions: Everything you need to extend Raycast | raycast/extensions        |
| `^https?://(?:www\\.)?youtube\\.com`          | `(.+?)(?:\\s*-[^-]*$\|$)` | Rust Tutorial Full Course - YouTube                                | Rust Tutorial Full Course |
| `.+?`                                         | `^(.+?)[\|–—•·-]`         | How to use promises - Learn web development \| MDN                 | How to use promises       |

### Edge cases

The paste handler tries to handle these edge cases intelligently:

1. If your cursor / selection is inside of an existing link, it'll paste normally, to allow you to edit the existing link more easily.
2. If you've selected an existing link, it'll replace the link's URL with the clipboard's content, keeping its title.

These edge cases are ignored when using the `Paste Markdown link` command to better replicate the behavior of the default `Insert Markdown link` command.

I've found these behaviors useful in my own testing, but if you run into problems with your workflow, please open an issue.
