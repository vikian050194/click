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

    test("Sections", async ({ page }) => {
        // Arrange
        const sections = page.locator("h2");

        // Assert
        await expect(sections.nth(0)).toHaveText("Popup autoclose");
    });

    test("Section: Popup autoclose", async ({ page }) => {
        // Arrange
        const pom = new OptionsPage(page);

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