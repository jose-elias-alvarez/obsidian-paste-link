import cleanTitle from "./clean-title";

const testRegex = "^(.+?)[|–—•·-]";

describe("cleanTitle", () => {
    it("should capture segment before bullet", () => {
        expect(
            cleanTitle(
                "Paste link title into selected link url · Issue #1 · jose-elias-alvarez/obsidian-paste-link · GitHub",
                testRegex
            )
        ).toBe("Paste link title into selected link url");
    });

    it("should capture segment before pipe", () => {
        expect(cleanTitle("Main Article Title | My Blog Site", testRegex)).toBe(
            "Main Article Title"
        );
    });

    it("should capture segment before hyphen", () => {
        expect(
            cleanTitle("JavaScript Tutorial - MDN Web Docs", testRegex)
        ).toBe("JavaScript Tutorial");
    });

    it("should capture segment before em dash", () => {
        expect(cleanTitle("Breaking News — CNN", testRegex)).toBe(
            "Breaking News"
        );
    });

    it("should return full title if no separator found", () => {
        expect(cleanTitle("Simple Title", testRegex)).toBe("Simple Title");
    });

    it("should handle multiple separators", () => {
        expect(
            cleanTitle("First Part | Second Part - Site Name", testRegex)
        ).toBe("First Part");
    });

    it("should handle whitespace around separators", () => {
        expect(cleanTitle("Main Title     |    Site Name", testRegex)).toBe(
            "Main Title"
        );
    });
});
