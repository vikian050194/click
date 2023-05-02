import {
    Sync,
    Local,
    OPTIONS,
    TARGETS,
    funcs
} from "../common/index.js";
import { match } from "../common/match.js";

const makeDiv = (id, text = null, className = null) => {
    const newElement = document.createElement("div");
    newElement.id = id;
    if (className) {
        newElement.className = className;
    }
    if (text) {
        const textContent = document.createTextNode(text);
        newElement.appendChild(textContent);
    }
    return newElement;
};

document.addEventListener("DOMContentLoaded", async () => {
    const isAutomaticEnabled = await Sync.get(OPTIONS.IS_AUTOMATIC_EXECUTION_ENABLED);
    const isLoggingEnabled = await Sync.get(OPTIONS.IS_EXECUTION_LOGGING_ENABLED);

    const isAutocloseEnabled = await Sync.get(OPTIONS.IS_AUTOCLOSE_ENABLED);
    const autocloseTimeSec = await Sync.get(OPTIONS.AUTOCLOSE_TIME);

    const targets = await Local.get(TARGETS.TARGETS);

    const $root = document.getElementById("root");
    const $message = makeDiv("message");

    $root.append($message);
    $message.innerText = "...";

    const setMessage = (result) => $message.innerText = result;

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

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const manualTargets = [];
    const autoTargets = [];

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
        await log("automatic execution is disabled", tab.id);
    }

    const matchedTargets = [...autoTargets, ...manualTargets];

    document.addEventListener("keydown", async ({ key }) => {
        switch (key) {
            case "Enter": {
                await log("manual execution", tab.id);
                if (matchedTargets.length === 1) {
                    const [target] = matchedTargets;
                    await click(target.selector, tab.id);
                    setMessage(`${target.name}: successful click`);
                    await log(`target #${target.id}: successful click`, tab.id);
                } else {
                    setMessage(`${matchedTargets.length} matched targets`);
                    await log(`manual execution is failed: ${matchedTargets.length} matched targets`, tab.id);
                }

                if (isAutocloseEnabled) {
                    setTimeout(window.close, autocloseTimeSec * 1000);
                }
                break;
            }
        }
    });
});
