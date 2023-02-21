import {
    MENU
} from "../common/index.js";
import {
    System
} from "./handlers/index.js";

chrome.runtime.onInstalled.addListener(System.onInstall);

chrome.contextMenus.onClicked.addListener(async (info) => {
    switch (info.menuItemId) {
        case MENU.TARGETS:
            await chrome.tabs.create({
                url: "targets/targets.html"
            });
            break;
        default:
            break;
    }
});