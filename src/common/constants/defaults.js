import * as OPTIONS from "./options.js";
import { T1 } from "./autoclose.js";
import { RED } from "./colors.js";

export const DEFAULTS = {
    [OPTIONS.IS_AUTOMATIC_EXECUTION_ENABLED]: true,
    [OPTIONS.IS_EXECUTION_LOGGING_ENABLED]: true,

    [OPTIONS.UI_SELECTED_ITEM_COLOR]: RED,

    [OPTIONS.IS_AUTOCLOSE_ENABLED]: true,
    [OPTIONS.AUTOCLOSE_TIME]: T1
};
