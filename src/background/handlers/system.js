import {
    Sync,
    Local,
    OPTIONS,
    MENU,
    TARGETS
} from "../../common/index.js";

const updateDefaultValues = async () => {
    // execution
    const isAutomaticEnabled = await Sync.get(OPTIONS.IS_AUTOMATIC_EXECUTION_ENABLED);
    if (isAutomaticEnabled === undefined) {
        await Sync.set(OPTIONS.IS_AUTOMATIC_EXECUTION_ENABLED, true);
    }

    const isLoggingEnabled = await Sync.get(OPTIONS.IS_EXECUTION_LOGGING_ENABLED);
    if (isLoggingEnabled === undefined) {
        await Sync.set(OPTIONS.IS_EXECUTION_LOGGING_ENABLED, true);
    }

    // autoclose
    const isAutocloseEnabled = await Sync.get(OPTIONS.IS_AUTOCLOSE_ENABLED);
    if (isAutocloseEnabled === undefined) {
        await Sync.set(OPTIONS.IS_AUTOCLOSE_ENABLED, true);
    }

    const autocloseTime = await Sync.get(OPTIONS.AUTOCLOSE_TIME);
    if (autocloseTime === undefined) {
        await Sync.set(OPTIONS.AUTOCLOSE_TIME, 1);
    }

    // local data
    const targets = await Local.get(TARGETS.TARGETS);
    if (targets === undefined) {
        await Local.set(TARGETS.TARGETS, []);
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
