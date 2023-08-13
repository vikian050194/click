import * as OPTIONS from "./options.js";
import { T1 } from "./autoclose.js";
import { RED } from "./colors.js";
import { P12 } from "./fonts.js";
import { BOLD } from "./weight.js";

export const DEFAULTS = {
    [OPTIONS.IS_AUTOMATIC_EXECUTION_ENABLED]: true,
    [OPTIONS.IS_EXECUTION_LOGGING_ENABLED]: true,

    [OPTIONS.UI_SELECTED_ITEM_COLOR]: RED,
    [OPTIONS.UI_SELECTED_ITEM_ARROW]: true,
    [OPTIONS.UI_SELECTED_ITEM_FONT_WEIGHT]: BOLD,
    [OPTIONS.UI_FONT_SIZE]: P12,

    [OPTIONS.IS_AUTOCLOSE_ENABLED]: true,
    [OPTIONS.AUTOCLOSE_TIME]: T1,

    [OPTIONS.CHANGELOG_SHOW]: true
};
