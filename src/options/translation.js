const translations = {
};

export const getTranslation = (key) => {
    return translations[key] === undefined ? key : translations[key];
};