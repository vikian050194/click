import { test, expect, timeout } from "../fixtures.js";
import {
    PopupPage,
    OptionsPage,
    TargetsPage
} from "../pom/index.js";

test.describe("Automatic", () => {
    test.beforeEach(async ({ page, extensionId, context }) => {
        await page.waitForTimeout(timeout);

        const options = new OptionsPage(page, extensionId);
        await options.goto();

        await options.getPin(2).click();
        await options.autoclose.enabled.click();
        await options.save();

        await context.pages()[0].close();
    });

    test("No targets", async ({ page, extensionId }) => {
        // Arrange
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
        await expect(pom.message).toHaveText("0 automatic matched targets");

        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([
            "\"click\" extension is activated",
            "automatic execution",
            "automatic execution is failed: 0 matched targets"
        ]);
    });

    test("One target, mismatch URL", async ({ page, extensionId }) => {
        // Arrange
        const targets = new TargetsPage(page, extensionId);
        await targets.goto();

        await targets.create();
        const row = targets.getRowPom(1);
        await row.name.setValue("first click target");
        await row.pattern.setValue("test.html");
        await row.isAuto.click();
        await targets.save();

        const pom = new PopupPage(page, extensionId);

        await page.addInitScript(() => {
            chrome.tabs.query = () => { return [{ id: 1, url: "not.html" }]; };
            window.log = [];
            chrome.scripting.executeScript = (obj) => {
                window.log.push(obj.args[0]);
                return [];
            };
        });

        await pom.goto();

        // Assert
        await expect(pom.message).toHaveText("0 automatic matched targets");

        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([
            "\"click\" extension is activated",
            "target #1: active",
            "target #1: URL is not matched",
            "automatic execution",
            "automatic execution is failed: 0 matched targets"
        ]);
    });

    test("One inactive target", async ({ page, extensionId }) => {
        // Arrange
        const targets = new TargetsPage(page, extensionId);
        await targets.goto();

        await targets.create();
        const row = targets.getRowPom(1);
        await row.name.setValue("first click target");
        await row.pattern.setValue("test.html");
        await row.selector.setValue("#message");
        await row.isActive.click();
        await row.isAuto.click();
        await targets.save();

        const pom = new PopupPage(page, extensionId);

        await page.addInitScript(() => {
            chrome.tabs.query = () => { return [{ id: 1, url: "test.html" }]; };
            window.log = [];
            chrome.scripting.executeScript = (obj) => {
                window.log.push(obj.args[0]);
                return [];
            };
        });

        await pom.goto();

        // Assert
        await expect(pom.message).toHaveText("0 automatic matched targets");

        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([
            "\"click\" extension is activated",
            "target #1: inactive",
            "automatic execution",
            "automatic execution is failed: 0 matched targets"
        ]);
    });

    test("One active manual target", async ({ page, extensionId }) => {
        // Arrange
        const targets = new TargetsPage(page, extensionId);
        await targets.goto();

        await targets.create();
        const row = targets.getRowPom(1);
        await row.name.setValue("first click target");
        await row.pattern.setValue("test.html");
        await row.selector.setValue("#message");
        await row.isActive.click();
        await targets.save();

        const pom = new PopupPage(page, extensionId);

        await page.addInitScript(() => {
            chrome.tabs.query = () => { return [{ id: 1, url: "test.html" }]; };
            window.log = [];
            chrome.scripting.executeScript = (obj) => {
                window.log.push(obj.args[0]);
                return [];
            };
        });

        await pom.goto();

        // Assert
        await expect(pom.message).toHaveText("0 automatic matched targets");

        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([
            "\"click\" extension is activated",
            "target #1: inactive",
            "automatic execution",
            "automatic execution is failed: 0 matched targets"
        ]);
    });

    test("One active target", async ({ page, extensionId }) => {
        // Arrange
        const targets = new TargetsPage(page, extensionId);
        await targets.goto();

        await targets.create();
        const row = targets.getRowPom(1);
        await row.name.setValue("first click target");
        await row.pattern.setValue("test.html");
        await row.selector.setValue("#message");
        await row.isAuto.click();
        await targets.save();

        const pom = new PopupPage(page, extensionId);

        await page.addInitScript(() => {
            chrome.tabs.query = () => { return [{ id: 1, url: "test.html" }]; };
            window.log = [];
            chrome.scripting.executeScript = (obj) => {
                window.log.push(obj.args[0]);
                return [{ result: 1 }];
            };
        });

        await pom.goto();

        // Assert
        await expect(pom.message).toHaveText("first click target: successful click");

        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([
            "\"click\" extension is activated",
            "target #1: active",
            "target #1: URL is matched",
            "#message",
            "target #1: single matched DOM element",
            "target #1: automatic execution",
            "automatic execution",
            "#message",
            "target #1: successful click"
        ]);
    });

    test("One active target, 0 DOM elements", async ({ page, extensionId }) => {
        // Arrange
        const targets = new TargetsPage(page, extensionId);
        await targets.goto();

        await targets.create();
        const row = targets.getRowPom(1);
        await row.name.setValue("first click target");
        await row.pattern.setValue("test.html");
        await row.selector.setValue("#message");
        await row.isAuto.click();
        await targets.save();

        const pom = new PopupPage(page, extensionId);

        await page.addInitScript(() => {
            chrome.tabs.query = () => { return [{ id: 1, url: "test.html" }]; };
            window.log = [];
            chrome.scripting.executeScript = (obj) => {
                window.log.push(obj.args[0]);
                return [{ result: 0 }];
            };
        });

        await pom.goto();

        // Assert
        await expect(pom.message).toHaveText("0 automatic matched targets");

        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([
            "\"click\" extension is activated",
            "target #1: active",
            "target #1: URL is matched",
            "#message",
            "target #1: 0 matched DOM elements",
            "automatic execution",
            "automatic execution is failed: 0 matched targets"
        ]);
    });

    test("One active target, 2 DOM elements", async ({ page, extensionId }) => {
        // Arrange
        const targets = new TargetsPage(page, extensionId);
        await targets.goto();

        await targets.create();
        const row = targets.getRowPom(1);
        await row.name.setValue("first click target");
        await row.pattern.setValue("test.html");
        await row.selector.setValue("#message");
        await row.isAuto.click();
        await targets.save();

        const pom = new PopupPage(page, extensionId);

        await page.addInitScript(() => {
            chrome.tabs.query = () => { return [{ id: 1, url: "test.html" }]; };
            window.log = [];
            chrome.scripting.executeScript = (obj) => {
                window.log.push(obj.args[0]);
                return [{ result: 2 }];
            };
        });

        await pom.goto();

        // Assert
        await expect(pom.message).toHaveText("0 automatic matched targets");

        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([
            "\"click\" extension is activated",
            "target #1: active",
            "target #1: URL is matched",
            "#message",
            "target #1: 2 matched DOM elements",
            "automatic execution",
            "automatic execution is failed: 0 matched targets"
        ]);
    });

    test("Two active targets", async ({ page, extensionId }) => {
        // Arrange
        const targets = new TargetsPage(page, extensionId);
        await targets.goto();

        await targets.create();
        const row1 = targets.getRowPom(1);
        await row1.name.setValue("first click target");
        await row1.pattern.setValue("test.html");
        await row1.selector.setValue("#message");
        await row1.isAuto.click();
        await targets.save();

        await targets.create();
        const row2 = targets.getRowPom(2);
        await row2.name.setValue("second click target");
        await row2.pattern.setValue("test.html");
        await row2.selector.setValue("#message");
        await row2.isAuto.click();
        await targets.save();

        const pom = new PopupPage(page, extensionId);

        await page.addInitScript(() => {
            chrome.tabs.query = () => { return [{ id: 1, url: "test.html" }]; };
            window.log = [];
            chrome.scripting.executeScript = (obj) => {
                window.log.push(obj.args[0]);
                return [{ result: 1 }];
            };
        });

        await pom.goto();

        // Assert
        await expect(pom.message).toHaveText("2 automatic matched targets");

        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([
            "\"click\" extension is activated",
            "target #1: active",
            "target #1: URL is matched",
            "#message",
            "target #1: single matched DOM element",
            "target #1: automatic execution",
            "target #2: active",
            "target #2: URL is matched",
            "#message",
            "target #2: single matched DOM element",
            "target #2: automatic execution",
            "automatic execution",
            "automatic execution is failed: 2 matched targets"
        ]);
    });
});