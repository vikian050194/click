import {
    Sync,
    Local,
    OPTIONS,
    TARGETS,
    funcs,
    dom
} from "../common/index.js";
import { match } from "../common/match.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Get options
    const isAutomaticEnabled = await Sync.get(OPTIONS.IS_AUTOMATIC_EXECUTION_ENABLED);
    const isLoggingEnabled = await Sync.get(OPTIONS.IS_EXECUTION_LOGGING_ENABLED);

    const color = await Sync.get(OPTIONS.UI_SELECTED_ITEM_COLOR);
    const weight = await Sync.get(OPTIONS.UI_SELECTED_ITEM_FONT_WEIGHT);
    const fontSize = await Sync.get(OPTIONS.UI_FONT_SIZE);
    const isArrow = await Sync.get(OPTIONS.UI_SELECTED_ITEM_ARROW);

    const isAutocloseEnabled = await Sync.get(OPTIONS.IS_AUTOCLOSE_ENABLED);
    const autocloseTimeSec = await Sync.get(OPTIONS.AUTOCLOSE_TIME);

    // Get data
    const targets = await Local.get(TARGETS.TARGETS);

    // UI items
    const arrowChar = "&#10148;";
    const visibleArrow = isArrow ? `<span>${arrowChar}</span>` : "";
    const invisibleArrow = isArrow ? `<span style="color:white;">${arrowChar}</span>` : "";
    const queryPlaceholder = "";

    // UI builders
    const makeDiv = dom.makeElementCreator("div");

    const makeId = (id) => `opt-${id}`;

    // DOM elements creating and updating
    const $rootElement = document.documentElement;
    const $root = document.getElementById("root");
    const $message = makeDiv({ id: "message" });
    const $options = makeDiv({ id: "options" });

    $root.append($message);

    const setMessage = (result) => $message.innerText = result;
    setMessage(queryPlaceholder);

    // Autoclose
    let autocloseId = null;
    const resetAutoclose = () => clearTimeout(autocloseId);

    // Data
    const manualTargets = [];
    const autoTargets = [];

    // Indexes
    let currentOptionIndex = 0;
    let maxOptionIndex = 0;

    // Functions
    const executeScript = async (f, x, tabId) => await chrome.scripting
        .executeScript({
            target: { tabId, allFrames: false },
            func: f,
            args: [x]
        });

    const log = async (x, tabId) => {
        if (isLoggingEnabled) {
            await executeScript(funcs.log, x, tabId);
        }
    };
    const test = async (x, tabId) => await executeScript(funcs.test, x, tabId);
    const click = async (x, tabId) => await executeScript(funcs.click, x, tabId);

    // Matching
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await log("\"click\" extension is activated", tab.id);

    for (const target of targets) {
        if (target.isActive === false) {
            await log(`target #${target.id}: inactive`, tab.id);
            continue;
        }

        await log(`target #${target.id}: active`, tab.id);

        if (match(tab.url, target.pattern)) {
            await log(`target #${target.id}: URL is matched`, tab.id);

            const injectionResults = await test(target.selector, tab.id);

            const injectionResult = injectionResults[0];

            if (injectionResult.result === 1) {
                await log(`target #${target.id}: single matched DOM element`, tab.id);

                if (target.isAuto) {
                    autoTargets.push(target);
                    await log(`target #${target.id}: automatic execution`, tab.id);
                } else {
                    manualTargets.push(target);
                    await log(`target #${target.id}: manual execution`, tab.id);
                }
            } else {
                await log(`target #${target.id}: ${injectionResult.result} matched DOM elements`, tab.id);
            }
        } else {
            await log(`target #${target.id}: URL is not matched`, tab.id);
        }
    }

    const matchedTargets = [...autoTargets, ...manualTargets];
    maxOptionIndex = matchedTargets.length - 1;

    if (matchedTargets.length > 0) {
        $root.append(document.createElement("hr"), $options);
    }

    $rootElement.style.setProperty("--selected-item-color", color);
    $rootElement.style.setProperty("--selected-item-font-weight", weight);
    $rootElement.style.setProperty("--font-size", `${fontSize}px`);

    // Render
    const render = () => {
        const elements = [];

        for (let index = 0; index <= maxOptionIndex; index++) {
            const option = matchedTargets[index];
            const isSelected = index == currentOptionIndex;
            const titlePrefix = isSelected ? visibleArrow : invisibleArrow;
            const title = titlePrefix + `#${option.id}:${option.name}`;
            const classList = ["option"];
            if (isSelected) {
                classList.push("selected");
            }
            elements.push(makeDiv({ id: makeId(index), innerHTML: title, classList }));
        }

        while ($options.firstChild) {
            $options.removeChild($options.firstChild);
        }

        $options.append(...elements);
    };

    render();

    if (isAutomaticEnabled) {
        await log("automatic execution", tab.id);

        if (autoTargets.length === 1) {
            const [target] = autoTargets;

            await click(target.selector, tab.id);

            setMessage(`${target.name}: successful click`);
            await log(`target #${target.id}: successful click`, tab.id);

            if (isAutocloseEnabled) {
                setTimeout(window.close, autocloseTimeSec * 1000);
            }
        } else {
            setMessage(`${autoTargets.length} automatic matched targets`);
            await log(`automatic execution is failed: ${autoTargets.length} matched targets`, tab.id);
        }
    } else {
        setMessage(`${matchedTargets.length} matched targets`);
        await log("automatic execution is disabled", tab.id);
    }

    document.addEventListener("keydown", async ({ key }) => {
        switch (key) {
            case "Enter": {
                await log("manual execution", tab.id);
                if (matchedTargets.length > 0) {
                    const target = matchedTargets[currentOptionIndex];
                    await click(target.selector, tab.id);
                    setMessage(`${target.name}: successful click`);
                    await log(`target #${target.id}: successful click`, tab.id);
                } else {
                    await log(`manual execution is failed: ${matchedTargets.length} matched targets`, tab.id);
                }
                if (isAutocloseEnabled) {
                    setTimeout(window.close, autocloseTimeSec * 1000);
                }
                break;
            }
            case "ArrowUp":
                resetAutoclose();
                currentOptionIndex = currentOptionIndex > 0 ? currentOptionIndex - 1 : maxOptionIndex;
                render();
                break;
            case "ArrowDown":
                resetAutoclose();
                currentOptionIndex = currentOptionIndex < maxOptionIndex ? currentOptionIndex + 1 : 0;
                render();
                break;
        }
    });
});
