import isUrl from "./is-url";

describe("isUrl", () => {
	it("should return true for a valid URL", () => {
		expect(isUrl("https://www.example.com")).toBe(true);
	});

	it("should return true for a non-HTTPS URL", () => {
		expect(isUrl("http://www.example.com")).toBe(true);
	});

	it("should return true for a file URI", () => {
		expect(isUrl("file:///Users/jose/my-file.txt")).toBe(true);
	});

	it("should return false for a random string", () => {
		expect(isUrl("not a url")).toBe(false);
	});

	it("should return false for an empty string", () => {
		expect(isUrl("")).toBe(false);
	});

	it("should return false if url contains newline", () => {
		expect(isUrl("https://www.example.com\n")).toBe(false);
	});

	it("should return true for a valid URL with a query parameter", () => {
		expect(isUrl("https://www.example.com?param=value")).toBe(true);
	});

	it("should return true for a valid URL with a port number", () => {
		expect(isUrl("https://www.example.com:8080")).toBe(true);
	});
});
