import { test, expect } from "./fixtures.js";
import {
    PopupPage,
    OptionsPage,
    TargetsPage
} from "./pom/index.js";

test.describe("Popup", () => {
    test.beforeEach(async ({ page, extensionId, context }) => {
        await page.waitForTimeout(1000);

        const options = new OptionsPage(page, extensionId);
        await options.goto();

        await options.autoclose.enabled.click();
        await options.save();

        const pom = new PopupPage(page, extensionId);
        await pom.goto();

        await context.pages()[0].close();
    });

    test.describe("Message", () => {
        test("Empty", async ({ page, extensionId }) => {
            // Arrange
            const pom = new PopupPage(page, extensionId);

            // Assert
            await expect(pom.message).toHaveText("...");
        });

        test("Try to click without targets", async ({ page, extensionId }) => {
            // Arrange
            const pom = new PopupPage(page, extensionId);

            // Act
            await pom.enter();

            // Assert
            await expect(pom.message).toHaveText("URL is not matched");
        });

        test("There are no matched targets because of URL", async ({ page, extensionId }) => {
            // Arrange
            const targets = new TargetsPage(page, extensionId);
            await targets.goto();

            await targets.create();
            const row = targets.getRowPom(1);
            await row.name.setValue("first click target");
            await row.pattern.setValue("test.html");
            await targets.save();

            const pom = new PopupPage(page, extensionId);
            await pom.goto();

            // Act
            await pom.enter();

            // Assert
            await expect(pom.message).toHaveText("URL is not matched");
        });
    });
});