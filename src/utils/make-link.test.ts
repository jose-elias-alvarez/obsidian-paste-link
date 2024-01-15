import makeLink from "./make-link";

describe("makeLink", () => {
    it("should create a link with a title and content", () => {
        const title = "Example";
        const content = "https://www.example.com";
        const expectedOutput = "[Example](https://www.example.com)";
        expect(makeLink(title, content)).toBe(expectedOutput);
    });

    it("should create a link with a title that is already a link", () => {
        const title = "[Old Title](https://www.example.com)";
        const content = "https://www.example.com";
        const expectedOutput = "[Old Title](https://www.example.com)";
        expect(makeLink(title, content)).toBe(expectedOutput);
    });

    it("should create a link with an empty title and content", () => {
        const title = "";
        const content = "";
        const expectedOutput = "[]()";
        expect(makeLink(title, content)).toBe(expectedOutput);
    });

    it("should create a link with an empty title and non-empty content", () => {
        const title = "";
        const content = "https://www.example.com";
        const expectedOutput = "[](https://www.example.com)";
        expect(makeLink(title, content)).toBe(expectedOutput);
    });

    it("should create a link with a non-empty title and empty content", () => {
        const title = "Example";
        const content = "";
        const expectedOutput = "[Example]()";
        expect(makeLink(title, content)).toBe(expectedOutput);
    });

    it("should create a link with a title that has square brackets", () => {
        const title = "Example [with brackets]";
        const content = "https://www.example.com";
        const expectedOutput =
            "[Example [with brackets]](https://www.example.com)";
        expect(makeLink(title, content)).toBe(expectedOutput);
    });

    it("should create a link with a title that has parentheses", () => {
        const title = "Example (with parentheses)";
        const content = "https://www.example.com";
        const expectedOutput =
            "[Example (with parentheses)](https://www.example.com)";
        expect(makeLink(title, content)).toBe(expectedOutput);
    });

    it("should create a link with a title that has special characters", () => {
        const title = "Example with & and =";
        const content = "https://www.example.com";
        const expectedOutput =
            "[Example with & and =](https://www.example.com)";
        expect(makeLink(title, content)).toBe(expectedOutput);
    });

    it("should wrap link with angle brackets if it contains a space", () => {
        const title = "Blue jay";
        const content = "https://en.wikipedia.org/wiki/Blue jay";
        const expectedOutput =
            "[Blue jay](<https://en.wikipedia.org/wiki/Blue jay>)";
        expect(makeLink(title, content)).toBe(expectedOutput);
    });
});
