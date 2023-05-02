import { test, expect } from "./fixtures.js";
import { OptionsPage } from "./pom/index.js";

test.describe("Options", () => {
    test.beforeEach(async ({ page, extensionId }) => {
        await page.waitForTimeout(2000);

        const pom = new OptionsPage(page, extensionId);
        await pom.goto();
    });

    test.describe("Navigation", () => {
        test("Options", async ({ page }) => {
            // Arrange
            const link = page.locator("footer > span", { hasText: "options" });

            // Act
            await link.click();

            // Assert
            await expect(page).toHaveURL(new RegExp("options/options.html"));
        });

        test("Targets", async ({ page }) => {
            // Arrange
            const link = page.locator("footer > span", { hasText: "targets" });

            // Act
            await link.click();

            // Assert
            await expect(page).toHaveURL(new RegExp("targets/targets.html"));
        });
    });

    test("Header", async ({ page }) => {
        // Arrange
        const header = page.locator("h1");

        // Assert
        await expect(header).toHaveText("Options");
    });

    test.describe("Tabs and pins", () => {
        test("Pins", async ({ page }) => {
            // Arrange
            const pom = new OptionsPage(page);

            // Assert
            await expect(pom.getPin(1)).toHaveText("Execution");
            await expect(pom.getPin(2)).toHaveText("Autoclose");
        });

        test("Tabs", async ({ page }) => {
            // Arrange
            const pom = new OptionsPage(page);

            // Assert
            await expect(pom.getTab(1).locator("h2")).toHaveText("Execution");
            await expect(pom.getTab(2).locator("h2")).toHaveText("Popup autoclose");

            for (let i = 1; i <= 2; i++) {
                if (i === 1) {
                    await expect(pom.getTab(i)).toBeVisible();
                } else {
                    await expect(pom.getTab(i)).toBeHidden();
                }
            }
        });

        test("Tabs visibility", async ({ page }) => {
            // Arrange
            const pom = new OptionsPage(page);

            // Assert
            for (let i = 1; i <= 2; i++) {
                await pom.getPin(i).click();
                for (let j = 1; j <= 2; j++) {
                    if (i === j) {
                        await expect(pom.getTab(j)).toBeVisible();
                    } else {
                        await expect(pom.getTab(j)).toBeHidden();
                    }
                }
            }
        });
    });

    test("Section: Execution", async ({ page }) => {
        // Arrange
        const pom = new OptionsPage(page);

        await pom.execution.automatic.isChecked(true);
        await pom.execution.logging.isChecked(true);

        // Act
        await pom.execution.automatic.click();
        await pom.execution.logging.click();

        await pom.save();
        await pom.reload();

        // Assert
        await pom.execution.automatic.isChecked(false);
        await pom.execution.logging.isChecked(false);
    });

    test("Section: Popup autoclose", async ({ page }) => {
        // Arrange
        const pom = new OptionsPage(page);
        await pom.getPin(2).click();

        await pom.autoclose.enabled.isChecked(true);
        await pom.autoclose.time.hasValue("1");

        // Act
        await pom.autoclose.enabled.click();
        await pom.autoclose.time.setValue("2");

        await pom.save();
        await pom.reload();

        // Assert
        await pom.autoclose.enabled.isChecked(false);
        await pom.autoclose.time.hasValue("2");
    });
});