import {
    Sync,
    Local,
    OPTIONS,
    TARGETS,
    click
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
    const isAutocloseEnabled = await Sync.get(OPTIONS.IS_AUTOCLOSE_ENABLED);
    const autocloseTimeSec = await Sync.get(OPTIONS.AUTOCLOSE_TIME);

    const targets = await Local.get(TARGETS.TARGETS);

    const $root = document.getElementById("root");
    const $message = makeDiv("message");

    $root.append($message);
    $message.innerText = "...";

    const setMessage = (result) => $message.innerText = result;

    document.addEventListener("keydown", async ({ key }) => {
        switch (key) {
            case "Enter": {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                let isTargetMatched = false;

                for (const target of targets) {
                    if (target.isActive === false) {
                        continue;
                    }

                    if (match(tab.url, target.pattern)) {
                        const injectionResults = await chrome.scripting
                            .executeScript({
                                target: { tabId: tab.id, allFrames: false },
                                func: click,
                                args: [target.selector]
                            });
                        isTargetMatched = true;

                        const injectionResult = injectionResults[0];

                        if (injectionResult.result === 1) {
                            setMessage(`${target.name}: done`);
                            break;
                        } else {
                            setMessage(`${target.name}: ${injectionResult.result} elements are found`);
                        }
                    }
                }

                if (!isTargetMatched) {
                    setMessage("URL is not matched");
                }

                if (isAutocloseEnabled) {
                    setTimeout(window.close, autocloseTimeSec * 1000);
                }

                break;
            }
        }
    });
});
