import { EditorPosition } from "obsidian";
import isCursorInLink from "./is-cursor-in-link";

describe("isCursorInLink", () => {
	it("should return true if cursor is inside a link title", () => {
		const cursor: EditorPosition = { line: 0, ch: 15 };
		const line = "This is a [link](https://www.example.com)";
		expect(isCursorInLink(cursor, line)).toBe(true);
	});

	it("should return true if cursor is inside a link body", () => {
		const cursor: EditorPosition = { line: 0, ch: 21 };
		const line = "This is a [link](https://www.example.com)";
		expect(isCursorInLink(cursor, line)).toBe(true);
	});

	it("should return false if cursor is before a link", () => {
		const cursor: EditorPosition = { line: 0, ch: 0 };
		const line = "This is a [link](https://www.example.com)";
		expect(isCursorInLink(cursor, line)).toBe(false);
	});

	it("should return false if cursor is beyond the end of a link", () => {
		const cursor: EditorPosition = { line: 0, ch: 55 };
		const line =
			"This is a [link](https://www.example.com) and this is plain text";
		expect(isCursorInLink(cursor, line)).toBe(false);
	});

	it("should return true if cursor is at the beginning of a link", () => {
		const cursor: EditorPosition = { line: 0, ch: 11 };
		const line = "This is a [link](https://www.example.com)";
		expect(isCursorInLink(cursor, line)).toBe(true);
	});

	it("should return true if cursor is at the end of a link", () => {
		const cursor: EditorPosition = { line: 0, ch: 35 };
		const line =
			"This is a [link](https://www.example.com) and this is plain text";
		expect(isCursorInLink(cursor, line)).toBe(true);
	});

	it("should return false if line does not contain a link", () => {
		const cursor: EditorPosition = { line: 0, ch: 5 };
		const line = "This is a plain text line";
		expect(isCursorInLink(cursor, line)).toBe(false);
	});

	it("should return false if cursor is in plain brackets", () => {
		const cursor: EditorPosition = { line: 0, ch: 12 };
		const line = "This is a [plain] text line";
		expect(isCursorInLink(cursor, line)).toBe(false);
	});

	it("should return false if cursor is in plain parentheses", () => {
		const cursor: EditorPosition = { line: 0, ch: 12 };
		const line = "This is a (plain) text line";
		expect(isCursorInLink(cursor, line)).toBe(false);
	});

	it("should return false if cursor is in a malformed link", () => {
		const cursor: EditorPosition = { line: 0, ch: 12 };
		const line = "This is a (malformed)[https://www.example.com] link";
		expect(isCursorInLink(cursor, line)).toBe(false);
	});
});
