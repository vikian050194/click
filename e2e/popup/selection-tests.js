import { test, expect, timeout } from "../fixtures.js";
import {
    PopupPage,
    OptionsPage,
    TargetsPage
} from "../pom/index.js";

test.describe("Selection", () => {
    test.beforeEach(async ({ page, extensionId, context }) => {
        await page.waitForTimeout(timeout);

        const options = new OptionsPage(page, extensionId);
        await options.goto();

        await options.getPin(2).click();
        await options.ui.selectedItemArrow.click();
        await options.getPin(3).click();
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

        // Act
        await pom.up();
        await pom.down();
        await pom.up();

        // Assert
        await expect(pom.message).toHaveText("0 automatic matched targets");

        await expect(pom.selected).not.toBeVisible();
        await expect(pom.nth(0)).not.toBeVisible();
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
        await pom.up();
        await pom.down();
        await pom.up();

        // Assert
        await expect(pom.message).toHaveText("first click target: successful click");

        await expect(pom.selected).toHaveText("#1:first click target");
        await expect(pom.nth(0)).toHaveText("#1:first click target");
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

        // Act and assert
        await expect(pom.selected).toHaveText("#1:first click target");

        await pom.up();
        await expect(pom.selected).toHaveText("#2:second click target");

        await pom.down();
        await expect(pom.selected).toHaveText("#1:first click target");

        await pom.down();
        await expect(pom.selected).toHaveText("#2:second click target");
    });
});