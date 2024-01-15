const makeLink = (title: string, content: string) => {
    const regex = /\[(.*?)\]\((.*?)\)/;
    if (regex.test(title)) {
        // if the title already is a link, pull out the existing title
        title = title.match(/\[(.*?)\]/)?.[1] ?? "";
    }
    if (/\s/g.test(content) && !/^<.*?>$/g.test(content)) {
        // if link has spaces and is not an html link, wrap in <>
        content = `<${content}>`;
    }
    return `[${title}](${content})`;
};

export default makeLink;
