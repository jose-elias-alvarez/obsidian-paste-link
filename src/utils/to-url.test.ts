import toUrl from "./to-url";

describe("toUrl", () => {
    it("should return URL object for valid URL", () => {
        expect(toUrl("https://www.example.com")).toBeInstanceOf(URL);
    });

    it("should return URL object for a non-HTTPS URL", () => {
        expect(toUrl("http://www.example.com")).toBeInstanceOf(URL);
    });

    it("should return URL object for a file URI", () => {
        expect(toUrl("file:///Users/jose/my-file.txt")).toBeInstanceOf(URL);
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
