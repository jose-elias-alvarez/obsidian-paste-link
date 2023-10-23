const isUrl = (str: string) => {
	if (str.includes("\n")) return false;
	try {
		new URL(str);
		return true;
	} catch {
		return false;
	}
};

export default isUrl;
