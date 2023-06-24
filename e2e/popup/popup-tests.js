import { test, expect, timeout } from "../fixtures.js";
import {
    PopupPage,
    OptionsPage
} from "../pom/index.js";

test.describe("Popup", () => {
    test.beforeEach(async ({ page, extensionId, context }) => {
        await page.waitForTimeout(timeout);

        const options = new OptionsPage(page, extensionId);
        await options.goto();

        await options.getPin(2).click();
        await options.autoclose.enabled.click();
        await options.save();

        await context.pages()[0].close();
    });

    test("Logging is disabled", async ({ page, extensionId }) => {
        // Arrange
        const options = new OptionsPage(page, extensionId);
        await options.goto();

        await options.execution.logging.click();
        await options.save();

        const pom = new PopupPage(page, extensionId);

        await page.addInitScript(() => {
            chrome.tabs.query = () => { return [{ id: 1, url: "test" }]; };
            window.log = [];
            chrome.scripting.executeScript = (obj) => {
                window.log.push(obj.args[0]);
                return [];
            };
        });

        await pom.goto();

        // Assert
        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([]);
    });
});