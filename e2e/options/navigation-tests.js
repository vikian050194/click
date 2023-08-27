import { test, expect, timeout } from "../fixtures.js";
import { OptionsPage } from "../pom/index.js";

test.describe("Navigation", () => {
    test.beforeEach(async ({ page, extensionId, context }) => {
        await page.waitForTimeout(timeout);

        // TODO handle changelog automatic opening somehow else
        await context.pages()[0].close();
        await context.pages()[1].close();

        const pom = new OptionsPage(page, extensionId);
        await pom.goto();
    });

    test("Header", async ({ page }) => {
        // Arrange
        const header = page.locator("header > h1");

        // Assert
        await expect(header).toHaveText("Options");
    });

    test("Options", async ({ page }) => {
        // Arrange
        const pom = new OptionsPage(page);

        // Act
        await pom.navigation.options.click();

        // Assert
        await expect(page).toHaveURL(new RegExp("options/options.html"));
    });

    test("Targets", async ({ page }) => {
        // Arrange
        const pom = new OptionsPage(page);

        // Act
        await pom.navigation.targets.click();

        // Assert
        await expect(page).toHaveURL(new RegExp("targets/targets.html"));
    });

    test("Changelog", async ({ page }) => {
        // Arrange
        const pom = new OptionsPage(page);

        // Act
        await pom.navigation.changelog.click();

        // Assert
        await expect(page).toHaveURL(new RegExp("changelog/changelog.html"));
    });

    test("Version", async ({ page }) => {
        // Arrange
        const pom = new OptionsPage(page);

        // Assert
        await pom.checkVersion();
    });
});