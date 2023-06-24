import {
    Sync,
    Local,
    OPTIONS,
    MENU,
    TARGETS,
    DEFAULTS
} from "../../common/index.js";

const updateDefaultValues = async () => {
    const targets = await Local.get(TARGETS.TARGETS);
    if (targets === undefined) {
        await Local.set(TARGETS.TARGETS, []);
    }

    for (const key in OPTIONS) {
        const currentValue = await Sync.get(OPTIONS[key]);
        if (currentValue === undefined) {
            await Sync.set(OPTIONS[key], DEFAULTS[OPTIONS[key]]);
        }
    }
};

const updateMenu = () => {
    chrome.contextMenus.create({
        id: MENU.TARGETS,
        title: "Targets",
        contexts: ["action"],
        type: "normal",
        enabled: true
    });
};

export const onInstall = async () => {
    updateMenu();

    await updateDefaultValues();
};
