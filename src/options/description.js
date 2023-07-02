import {
    OPTIONS,
    DEFAULTS
} from "../common/index.js";
import { getTranslation } from "./translation.js";

class Description {
    constructor(id, title, paragraphs) {
        this.id = id;
        this.title = title;
        this.paragraphs = paragraphs;
    }
}

const getDefault = (key) => `<i>Default value is &laquo;${getTranslation(DEFAULTS[key])}&raquo;.</i>`;

const makeDescription = (key, title, paragraphs) => new Description(key, title, [...paragraphs, getDefault(key)]);

export const descriptions = [
    makeDescription(
        OPTIONS.IS_AUTOMATIC_EXECUTION_ENABLED,
        "Automatic execution enabled",
        [
            "Automatic execution on extension activation.",
            "If there is only one matched automatic target, then it will be executed."
        ]
    ),
    makeDescription(
        OPTIONS.IS_EXECUTION_LOGGING_ENABLED,
        "Execution logging enabled",
        [
            "Log extension actions to active page Console.",
            "It's useful for understanding of hard cases and unexpected behaviour."
        ]
    ),

    makeDescription(
        OPTIONS.UI_SELECTED_ITEM_COLOR,
        "Selected item color",
        [
            "Color of selected item.",
            "It's also used in different places on options page."
        ]
    ),

    makeDescription(
        OPTIONS.IS_AUTOCLOSE_ENABLED,
        "Autoclose enabled",
        [
            "If enabled then popup will be closed automatically after usage.",
            "It's possible to cancel closing by any key pressing."
        ]
    ),
    makeDescription(
        OPTIONS.AUTOCLOSE_TIME,
        "Autoclose time",
        [
            "Popup autoclose time in seconds."
        ]
    )
];