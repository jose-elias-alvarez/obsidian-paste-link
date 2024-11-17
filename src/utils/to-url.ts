const toUrl = (str: string): URL | null => {
    if (str.includes("\n")) return null;
    try {
        return new URL(str);
    } catch {
        return null;
    }
};

export default toUrl;
