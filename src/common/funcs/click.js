export const click = (selector) => {
    const elements = document.querySelectorAll(selector);

    if (elements.length === 1) {
        elements[0].click();
    }

    return elements.length;
};
