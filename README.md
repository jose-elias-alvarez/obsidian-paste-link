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

- An option to disable overriding Obsidian's paste handler
- Separate commands to control pasting behavior
- Cleaner code, which also resulted in fixing bugs / edge cases

The ability to fetch page titles was inspired by [obsidian-auto-link-title](https://github.com/zolrath/obsidian-auto-link-title) and incorporates the following improvements:

- Using `fetch()` vs. an Electron window to get HTTP page titles, which is faster and more predictable
- Page-specific handlers for sites that don't normally expose titles (e.g. Reddit)
- An option to clean page titles using page-specific regular expressions

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

If the `Fetch page titles on paste` setting is enabled, the plugin will attempt to fetch page titles from HTTP URLs and use them as link titles when `Override paste handler` is enabled. Alternatively, you can also fetch page titles on demand using the `Paste link and fetch page title` command.

Note that some pages (e.g. SPAs) may not include the full title in their HTML, and behavior may be inconsistent across platforms. Exceptions are handled on a best-case basis, and contributions to add new handlers are very welcome.

#### Page title regexes

You can optionally clean page titles before pasting using regular expressions. Each row in the the plugin's settings has three components, from left to right:

1. **Page regex**: matches against the page's full URL to determine if this rule applies
2. **Title regex**: extracts the desired part(s) from either the page title or URL
3. **Template** (optional): formats the extracted parts using $1, $2, etc. for capture groups

This is how the plugin cleans page titles:

1. The plugin checks each rule from top to bottom, stopping at the first match
2. If the **Page regex** matches the current page URL, it applies the **Title regex** to the page's title (or to the URL itself if it's a non-HTTP URL)
3. The **Title regex** extracts parts of the title (or URL) using capture groups
4. If a **Template** is provided, it's filled in with captures from **Title regex**; otherwise, the first capture group ($1) is used (and any extra whitespace is trimmed)

This is not as scary as seems! Let's look at some examples:

- **GitHub issues**: to extract just the issue title from `Add dark mode support · Issue #123 · raycast/extensions`:

    - Page regex: `^https?://(?:www\.)?github\.com/.+?/issue`
    - Title regex: `^(.+?)\s*·`
    - Result: `Add dark mode support`

- **YouTube videos**: to remove the "- YouTube" suffix from `Rust Tutorial Full Course - YouTube`:

    - Page regex: `^https?://(?:www\.)?youtube\.com`
    - Title regex: `(.+?)(?:\s*-[^-]*$|$)`
    - Result: `Rust Tutorial Full Course`

- **General separators**: to extract content before common separators such as `-`, `|`, `•`:

    - Page regex: `.+?` (matches any URL)
    - Title regex: `^(.+?)\s*[|–—•·-]`
    - Result: `How to use promises` (from `How to use promises - Learn web development | MDN`)

- **Stack Overflow template**: to reformat titles like `javascript - How to format dates? - Stack Overflow` to emphasize the technology:

    - Page regex: `^https?://(?:www\.)?stackoverflow\.com/questions`
    - Title regex: `([^-]+) - (.+?) - Stack Overflow`
    - Template: `[$1] $2`
    - Result: `[javascript] How to format dates?`

- **VS Code URLs**: to create titles from VS Code file URLs:

    - Page regex: `^vscode://file/`
    - Title regex: `^vscode://file/.*/(.+?):(\d+)` (since this is a non-HTTP URL, this matches against the URL itself)
    - Template: `$1 (line $2)`
    - Result: `script.js (line 42)` (from `vscode://file/Users/username/project/script.js:42`)

Additional notes:

- To debug regexes, use the `Check URL` field in the plugin's settings to see if the provided URL produces the expected title.
- If you're not good with regular expressions, copy-paste the documentation above and ask ChatGPT. (Naming things is hard.)
- Since regexes are matched in order from top to bottom, you can set specific rules followed by general fallbacks.
- To temporarily bypass any configured regexes, use the `Paste link and fetch full page title` command.
- Regexes are parsed using the [Javascript RegExp() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp). Use [regex101](https://regex101.com) for validation.

### Edge cases

The paste handler tries to handle these edge cases intelligently:

1. If your cursor / selection is inside of an existing link, it'll paste normally, to allow you to edit the existing link more easily.
2. If you've selected an existing link, it'll replace the link's URL with the clipboard's content, keeping its title.

These edge cases are ignored when using the `Paste Markdown link` command to better replicate the behavior of the default `Insert Markdown link` command.

I've found these behaviors useful in my own testing, but if you run into problems with your workflow, please open an issue.
