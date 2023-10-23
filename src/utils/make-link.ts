const makeLink = (title: string, content: string) => {
	const regex = /\[(.*?)\]\((.*?)\)/;
	if (regex.test(title)) {
		// if the title already is a link, pull out the existing title
		title = title.match(/\[(.*?)\]/)?.[1] ?? "";
	}
	return `[${title}](${content})`;
};

export default makeLink;
