const cleanTitle = (rawTitle: string, regex: string, template?: string) => {
    const match = rawTitle.match(new RegExp(regex));
    if (!match) return rawTitle.trim();

    if (template)
        return template.replace(/\$(\d+)/g, (_, index) => {
            const groupIndex = parseInt(index, 10);
            return match[groupIndex] || "";
        });

    return match[1]?.trim() || rawTitle.trim();
};

export default cleanTitle;
