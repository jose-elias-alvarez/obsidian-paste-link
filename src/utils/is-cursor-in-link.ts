import { EditorPosition } from "obsidian";

const isCursorInLink = (cursor: EditorPosition, line: string) => {
	const regex = /\[(.*?)\]\((.*?)\)/g;
	let match;
	while ((match = regex.exec(line)) !== null) {
		if (cursor.ch > match.index && cursor.ch < regex.lastIndex) {
			return true;
		}
	}
	return false;
};

export default isCursorInLink;
