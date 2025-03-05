import { EditorPosition } from "obsidian";

const isCursorInLink = (cursor: EditorPosition, line: string) => {
    // \[          literal [
    // ([^\[\]]*?) anything but []
    // \]          literal ]
    // \(          literal (
    // ([^()]*?)   anything but ()
    // \)          literal )
    const regex = /\[([^\[\]]*?)\]\(([^()]*?)\)/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
        const linkStart = match.index;
        const linkEnd = match.index + match[0].length;
        if (cursor.ch > linkStart && cursor.ch < linkEnd) {
            return true;
        }
    }
    return false;
};

export default isCursorInLink;
