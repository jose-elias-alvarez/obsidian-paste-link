import toUrl from "./to-url";

describe("toUrl", () => {
    it("should return URL object for valid URL", () => {
        const url = toUrl("https://example.com");
        expect(url).toBeInstanceOf(URL);
        expect(url?.protocol).toBe("https:");
    });

    it("should return URL object for a non-HTTPS URL", () => {
        const url = toUrl("http://example.com");
        expect(url).toBeInstanceOf(URL);
        expect(url?.protocol).toBe("http:");
    });

    it("should return URL object for non-HTTP(S) URL", () => {
        const url = toUrl("vscode://file/Users/jose/some_script.py:586");
        expect(url).toBeInstanceOf(URL);
        expect(url?.protocol).toBe("vscode:");
    });

    it("should return null for a random string", () => {
        expect(toUrl("not a url")).toBeNull();
    });

    it("should return null for an empty string", () => {
        expect(toUrl("")).toBeNull();
    });

    it("should return null if url contains newline", () => {
        expect(toUrl("https://www.example.com\n")).toBeNull();
    });

    it("should return URL object for a valid URL with a query parameter", () => {
        expect(toUrl("https://www.example.com?param=value")).toBeInstanceOf(
            URL,
        );
    });

    it("should return URL object for a valid URL with a port number", () => {
        expect(toUrl("https://www.example.com:8080")).toBeInstanceOf(URL);
    });
});
