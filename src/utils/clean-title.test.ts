import cleanTitle from "./clean-title";

const sampleRegex = "^(.+?)\\s*[|–—•·-]";
const urlRegex = "^https?://(?:www\\.)?([^/]+)";
const filePathRegex = "^vscode://file/.*/(.*?):(\\d+)";

describe("cleanTitle", () => {
    it("should capture segment before bullet", () => {
        expect(
            cleanTitle(
                "Paste link title into selected link url · Issue #1 · jose-elias-alvarez/obsidian-paste-link · GitHub",
                sampleRegex,
            ),
        ).toBe("Paste link title into selected link url");
    });

    it("should capture segment before pipe", () => {
        expect(
            cleanTitle("Main Article Title | My Blog Site", sampleRegex),
        ).toBe("Main Article Title");
    });

    it("should capture segment before hyphen", () => {
        expect(
            cleanTitle("JavaScript Tutorial - MDN Web Docs", sampleRegex),
        ).toBe("JavaScript Tutorial");
    });

    it("should capture segment before em dash", () => {
        expect(cleanTitle("Breaking News — CNN", sampleRegex)).toBe(
            "Breaking News",
        );
    });

    it("should return full title if no separator found", () => {
        expect(cleanTitle("Simple Title", sampleRegex)).toBe("Simple Title");
    });

    it("should handle multiple separators", () => {
        expect(
            cleanTitle("First Part | Second Part - Site Name", sampleRegex),
        ).toBe("First Part");
    });

    it("should handle whitespace around separators", () => {
        expect(cleanTitle("Main Title     |    Site Name", sampleRegex)).toBe(
            "Main Title",
        );
    });

    describe("templates", () => {
        it("should apply a simple template", () => {
            expect(
                cleanTitle(
                    "JavaScript Tutorial - MDN Web Docs",
                    sampleRegex,
                    "Title: $1",
                ),
            ).toBe("Title: JavaScript Tutorial");
        });

        it("should default to $1 when no template provided", () => {
            expect(
                cleanTitle("Main Article Title | My Blog Site", sampleRegex),
            ).toBe("Main Article Title");
        });

        it("should handle multiple capture groups in template", () => {
            expect(
                cleanTitle(
                    "vscode://file/Users/username/project/script.js:42",
                    filePathRegex,
                    "File: $1 (Line $2)",
                ),
            ).toBe("File: script.js (Line 42)");
        });

        it("should handle missing capture groups in template", () => {
            expect(
                cleanTitle(
                    "https://example.com/page",
                    urlRegex,
                    "Domain: $1 (Path: $2)",
                ),
            ).toBe("Domain: example.com (Path: )");
        });

        it("should handle repeated capture groups in template", () => {
            expect(
                cleanTitle(
                    "vscode://file/Users/username/project/script.js:42",
                    filePathRegex,
                    "$1 - $1 - Line $2",
                ),
            ).toBe("script.js - script.js - Line 42");
        });

        it("should return full title if no match, even with template", () => {
            expect(
                cleanTitle(
                    "Simple Title",
                    "pattern-that-doesnt-match",
                    "Template: $1",
                ),
            ).toBe("Simple Title");
        });
    });
});
