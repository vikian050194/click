import {
    Sync,
    OPTIONS
} from "../common/index.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Pins and tabs
    const pins = document.querySelectorAll("button.pin");
    const tabs = document.querySelectorAll("div.tab");

    const showTab = (showIndex) => {
        for (let index = 0; index < tabs.length; index++) {
            const tab = tabs[index];
            const value = tab.getAttribute("tab-id") === showIndex ? "block" : "none";
            tab.style.setProperty("display", value);
        }

        for (let index = 0; index < pins.length; index++) {
            const pin = pins[index];
            const value = pin.getAttribute("pin-id") === showIndex ? "underline" : "none";
            pin.style.setProperty("text-decoration", value);
        }
    };

    showTab("1");

    for (let index = 0; index < pins.length; index++) {
        const pin = pins[index];
        pin.addEventListener("click", (e) => {
            const showIndex = e.currentTarget.getAttribute("pin-id");
            showTab(showIndex);
        });
    }

    // Execution
    const $isAutomaticEnabled = document.getElementById(OPTIONS.IS_AUTOMATIC_EXECUTION_ENABLED);
    $isAutomaticEnabled.checked = await Sync.get(OPTIONS.IS_AUTOMATIC_EXECUTION_ENABLED);

    const $isLoggingEnabled = document.getElementById(OPTIONS.IS_EXECUTION_LOGGING_ENABLED);
    $isLoggingEnabled.checked = await Sync.get(OPTIONS.IS_EXECUTION_LOGGING_ENABLED);

    // Autoclose
    const $isAutocloseEnabled = document.getElementById(OPTIONS.IS_AUTOCLOSE_ENABLED);
    $isAutocloseEnabled.checked = await Sync.get(OPTIONS.IS_AUTOCLOSE_ENABLED);

    const $autocloseTimeSec = document.getElementById(OPTIONS.AUTOCLOSE_TIME);
    $autocloseTimeSec.value = await Sync.get(OPTIONS.AUTOCLOSE_TIME);

    // Save
    const $saveButton = document.getElementById("save");
    $saveButton.addEventListener("click", async () => {
        // Execution
        await Sync.set(OPTIONS.IS_AUTOMATIC_EXECUTION_ENABLED, $isAutomaticEnabled.checked);
        await Sync.set(OPTIONS.IS_EXECUTION_LOGGING_ENABLED, $isLoggingEnabled.checked);

        // Autoclose
        await Sync.set(OPTIONS.IS_AUTOCLOSE_ENABLED, $isAutocloseEnabled.checked);
        await Sync.set(OPTIONS.AUTOCLOSE_TIME, $autocloseTimeSec.value);
    });
});
