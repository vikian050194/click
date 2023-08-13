import { test, expect, timeout } from "../fixtures.js";
import {
    PopupPage,
    OptionsPage,
    TargetsPage
} from "../pom/index.js";

test.describe("Manual", () => {
    test.beforeEach(async ({ page, extensionId, context }) => {
        await page.waitForTimeout(timeout);

        // TODO handle changelog automatic opening somehow else
        await context.pages()[0].close();
        await context.pages()[1].close();

        const options = new OptionsPage(page, extensionId);
        await options.goto();

        await options.execution.automatic.click();
        await options.getPin(2).click();
        await options.ui.selectedItemArrow.click();
        await options.getPin(3).click();
        await options.autoclose.enabled.click();

        await options.save();
    });

    test("Arrow is visible", async ({ page, extensionId }) => {
        // Arrange
        const options = new OptionsPage(page, extensionId);
        await options.goto();

        await options.getPin(2).click();
        await options.ui.selectedItemArrow.click();
        await options.save();

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

        // Act
        await pom.enter();

        // Assert
        await expect(pom.selected).toHaveText("➤#1:first click target");
        await expect(pom.nth(0)).toHaveText("➤#1:first click target");
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

        // Act
        await pom.enter();

        // Assert
        await expect(pom.message).toHaveText("0 matched targets");

        await expect(pom.selected).not.toBeVisible();
        await expect(pom.nth(0)).not.toBeVisible();

        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([
            "\"click\" extension is activated",
            "automatic execution is disabled",
            "manual execution",
            "manual execution is failed: 0 matched targets"
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

        // Act
        await pom.enter();

        // Assert
        await expect(pom.message).toHaveText("0 matched targets");

        await expect(pom.selected).not.toBeVisible();
        await expect(pom.nth(0)).not.toBeVisible();

        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([
            "\"click\" extension is activated",
            "target #1: active",
            "target #1: URL is not matched",
            "automatic execution is disabled",
            "manual execution",
            "manual execution is failed: 0 matched targets"
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

        // Act
        await pom.enter();

        // Assert
        await expect(pom.message).toHaveText("0 matched targets");

        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([
            "\"click\" extension is activated",
            "target #1: inactive",
            "automatic execution is disabled",
            "manual execution",
            "manual execution is failed: 0 matched targets"
        ]);
    });

    test("One active automatic target", async ({ page, extensionId }) => {
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

        // Act
        await pom.enter();

        // Assert
        await expect(pom.message).toHaveText("first click target: successful click");

        await expect(pom.selected).toHaveText("#1:first click target");
        await expect(pom.nth(0)).toHaveText("#1:first click target");

        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([
            "\"click\" extension is activated",
            "target #1: active",
            "target #1: URL is matched",
            "#message",
            "target #1: single matched DOM element",
            "target #1: automatic execution",
            "automatic execution is disabled",
            "manual execution",
            "#message",
            "target #1: successful click"
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
        await targets.save();

        await targets.create();
        const row2 = targets.getRowPom(2);
        await row2.name.setValue("second click target");
        await row2.pattern.setValue("test.html");
        await row2.selector.setValue("#message");
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

        await expect(pom.message).toHaveText("2 matched targets");

        // Act
        await pom.enter();

        // Assert
        await expect(pom.message).toHaveText("first click target: successful click");

        await expect(pom.selected).toHaveText("#1:first click target");
        await expect(pom.nth(0)).toHaveText("#1:first click target");

        await expect(pom.nth(1)).toHaveText("#2:second click target");

        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([
            "\"click\" extension is activated",
            "target #1: active",
            "target #1: URL is matched",
            "#message",
            "target #1: single matched DOM element",
            "target #1: manual execution",
            "target #2: active",
            "target #2: URL is matched",
            "#message",
            "target #2: single matched DOM element",
            "target #2: manual execution",
            "automatic execution is disabled",
            "manual execution",
            "#message",
            "target #1: successful click"
        ]);
    });

    test("Two active targets - manual and automatic", async ({ page, extensionId }) => {
        // Arrange
        const targets = new TargetsPage(page, extensionId);
        await targets.goto();

        await targets.create();
        const row1 = targets.getRowPom(1);
        await row1.name.setValue("manual target");
        await row1.pattern.setValue("test.html");
        await row1.selector.setValue("#message");
        await targets.save();

        await targets.create();
        const row2 = targets.getRowPom(2);
        await row2.name.setValue("automatic target");
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

        await expect(pom.message).toHaveText("2 matched targets");

        // Act
        await pom.enter();

        // Assert
        await expect(pom.message).toHaveText("automatic target: successful click");

        await expect(pom.selected).toHaveText("#2:automatic target");
        await expect(pom.nth(0)).toHaveText("#2:automatic target");

        await expect(pom.nth(1)).toHaveText("#1:manual target");

        const log = await page.evaluate(() => window.log);
        await expect(log).toEqual([
            "\"click\" extension is activated",
            "target #1: active",
            "target #1: URL is matched",
            "#message",
            "target #1: single matched DOM element",
            "target #1: manual execution",
            "target #2: active",
            "target #2: URL is matched",
            "#message",
            "target #2: single matched DOM element",
            "target #2: automatic execution",
            "automatic execution is disabled",
            "manual execution",
            "#message",
            "target #2: successful click"
        ]);
    });
});