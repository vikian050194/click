export const test = (selector) => {
    const elements = document.querySelectorAll(selector);

    return elements.length;
};
