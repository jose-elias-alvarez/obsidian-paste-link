export const moveElementUp = (array: unknown[], index: number) => {
    if (array[index - 1] === undefined) return;
    [array[index], array[index - 1]] = [array[index - 1], array[index]];
};

export const moveElementDown = (array: unknown[], index: number) => {
    if (array[index + 1] === undefined) return;
    [array[index], array[index + 1]] = [array[index + 1], array[index]];
};
