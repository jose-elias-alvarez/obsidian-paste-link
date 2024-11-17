const cleanTitle = (rawTitle: string, regex: string) =>
    rawTitle.match(new RegExp(regex))?.[1]?.trim() || rawTitle.trim();

export default cleanTitle;
