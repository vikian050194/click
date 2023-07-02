import {
    dom,
    Sync,
    OPTIONS,
    COLORS,
    AUTOCLOSE
} from "../common/index.js";
import { descriptions } from "./description.js";
import { getTranslation } from "./translation.js";

document.addEventListener("DOMContentLoaded", async () => {
    const $rootElement = document.documentElement;
    const $modal = document.getElementById("modal-one");

    const icon = "{ &#8505; }";

    const openModal = (optionid) => {
        const description = descriptions.find(({ id }) => id === optionid);
        $modal.querySelector("h1").innerHTML = description.title;
        $modal.querySelector("div.description").innerHTML = description.paragraphs.map(p => `<p>${p}</p>`).join("");
        $modal.classList.add("open");
        const exits = $modal.querySelectorAll(".modal-exit");
        exits.forEach(function (exit) {
            exit.addEventListener("click", function (event) {
                event.preventDefault();
                $modal.classList.remove("open");
            });
        });
    };

    document.querySelectorAll("span.title").forEach(function (element) {
        const optionId = element.getAttribute("data-info-id");
        const description = descriptions.find(({ id }) => id === optionId);
        element.innerHTML = description.title;
    });

    document.querySelectorAll("span.info").forEach(function (trigger) {
        trigger.innerHTML = icon;
        trigger.addEventListener("click", function (event) {
            event.preventDefault();
            const optionId = event.target.getAttribute("data-info-id");
            openModal(optionId);
        });
    });

    const color = await Sync.get(OPTIONS.UI_SELECTED_ITEM_COLOR);
    $rootElement.style.setProperty("--new", color);

    const makeOption = dom.makeElementCreator("option");

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

    // Appearance
    const $selectedItemColor = document.getElementById(OPTIONS.UI_SELECTED_ITEM_COLOR);
    for (const value of COLORS.ORDERED) {
        $selectedItemColor.append(
            makeOption({ text: getTranslation(value), value }),
        );
    }
    $selectedItemColor.value = await Sync.get(OPTIONS.UI_SELECTED_ITEM_COLOR);

    // Autoclose
    const $isAutocloseEnabled = document.getElementById(OPTIONS.IS_AUTOCLOSE_ENABLED);
    $isAutocloseEnabled.checked = await Sync.get(OPTIONS.IS_AUTOCLOSE_ENABLED);

    const $autocloseTimeSec = document.getElementById(OPTIONS.AUTOCLOSE_TIME);
    for (const value of AUTOCLOSE.ORDERED) {
        $autocloseTimeSec.append(
            makeOption({ text: value.toString(), value }),
        );
    }
    $autocloseTimeSec.value = await Sync.get(OPTIONS.AUTOCLOSE_TIME);

    // Save
    const $saveButton = document.getElementById("save");
    $saveButton.addEventListener("click", async () => {
        // Execution
        await Sync.set(OPTIONS.IS_AUTOMATIC_EXECUTION_ENABLED, $isAutomaticEnabled.checked);
        await Sync.set(OPTIONS.IS_EXECUTION_LOGGING_ENABLED, $isLoggingEnabled.checked);

        // Appearance
        await Sync.set(OPTIONS.UI_SELECTED_ITEM_COLOR, $selectedItemColor.value);

        // Autoclose
        await Sync.set(OPTIONS.IS_AUTOCLOSE_ENABLED, $isAutocloseEnabled.checked);
        await Sync.set(OPTIONS.AUTOCLOSE_TIME, $autocloseTimeSec.value);
    });
});
