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

const updateMenu = async () => {
    await chrome.contextMenus.create({
        id: MENU.TARGETS,
        title: "Targets",
        contexts: ["action"],
        type: "normal",
        enabled: true
    });

    await chrome.contextMenus.create({
        id: MENU.CHANGELOG,
        title: "Changelog",
        contexts: ["action"],
        type: "normal",
        enabled: true
    });
};

const showChangelog = async (reason) => {
    const show = await Sync.get(OPTIONS.CHANGELOG_SHOW);

    if (!show) {
        return;
    }

    if (reason === "install" || reason === "update") {
        await chrome.tabs.create({
            url: `changelog/changelog.html?reason=${reason}`
        });
    }
};

export const onInstall = async ({ reason }) => {
    await updateMenu();

    await updateDefaultValues();

    await showChangelog(reason);
};