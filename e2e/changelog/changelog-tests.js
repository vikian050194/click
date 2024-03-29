import { test, expect, timeout } from "../fixtures.js";
import { ChangelogPage } from "../pom/changelog.js";

test.describe("Misc", () => {
    test.beforeEach(async ({ page, context }) => {
        await page.waitForTimeout(timeout * 2);

        await context.pages()[0].close();
    });

    test("Header", async ({ context }) => {
        // Arrange
        const page = context.pages()[1];
        const pom = new ChangelogPage(page);
        await pom.modal.close();
        const header = page.locator("header > h1");

        // Assert
        await expect(header).toHaveText("Changelog");
    });

    test("Update", async ({ context, extensionId }) => {
        // Arrange
        const page = context.pages()[1];
        const pom = new ChangelogPage(page, extensionId);

        // Act
        await pom.goto("update");

        // Assert
        await pom.modal.visible();
    });

    test("Open", async ({ context, extensionId }) => {
        // Arrange
        const page = context.pages()[1];
        const pom = new ChangelogPage(page, extensionId);

        // Act
        await pom.goto();

        // Assert
        await pom.modal.hidden();
    });

    test("Wrong reason", async ({ context, extensionId }) => {
        // Arrange
        const page = context.pages()[1];
        const pom = new ChangelogPage(page, extensionId);

        // Act
        await pom.goto("test");

        // Assert
        await pom.modal.hidden();
    });

    test("Options", async ({ context }) => {
        // Arrange
        const page = context.pages()[1];
        const pom = new ChangelogPage(page);
        await pom.modal.close();

        // Act
        await pom.navigation.options.click();

        // Assert
        await expect(page).toHaveURL(new RegExp("options/options.html"));
    });

    test("Targets", async ({ context }) => {
        // Arrange
        const page = context.pages()[1];
        const pom = new ChangelogPage(page);
        await pom.modal.close();

        // Act
        await pom.navigation.targets.click();

        // Assert
        await expect(page).toHaveURL(new RegExp("targets/targets.html"));
    });

    test("Changelog", async ({ context }) => {
        // Arrange
        const page = context.pages()[1];
        const pom = new ChangelogPage(page);
        await pom.modal.close();

        // Act
        await pom.navigation.changelog.click();

        // Assert
        await expect(page).toHaveURL(new RegExp("changelog/changelog.html"));
    });

    test("Version", async ({ context }) => {
        // Arrange
        const page = context.pages()[1];
        const pom = new ChangelogPage(page);

        // Assert
        await pom.checkVersion();
    });
});