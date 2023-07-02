import {
    COLORS
} from "../common/index.js";

const translations = {
    [COLORS.BLUE]: "blue",
    [COLORS.VIOLET]: "violet",
    [COLORS.RED]: "red",
    [COLORS.ORANGE]: "orange",
    [COLORS.CYAN]: "cyan",
    [COLORS.YELLOW]: "yellow",
    [COLORS.PINK]: "pink",
    [COLORS.GREEN]: "green",
    [COLORS.GRAY]: "gray"
};

export const getTranslation = (key) => {
    return translations[key] === undefined ? key : translations[key];
};