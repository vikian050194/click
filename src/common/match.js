export const match = (line, pattern) => {
    return new RegExp(pattern).test(line);
};