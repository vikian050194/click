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
    ),
    makeDescription(
        OPTIONS.IS_AUTOMATIC_EXECUTION_ENABLED,
        "Automatic execution enabled",
        [
            "Automatic execution start on extension activation."
        ]
    ),
    makeDescription(
        OPTIONS.IS_EXECUTION_LOGGING_ENABLED,
        "Execution logging enabled",
        [
            "Log execution to active page Console."
        ]
    )
];