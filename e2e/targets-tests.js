import { test, expect } from "./fixtures.js";
import { TargetsPage } from "./pom/index.js";

test.describe("Targets", () => {
    test.beforeEach(async ({ page, extensionId }) => {
        await page.waitForTimeout(2000);

        const pom = new TargetsPage(page, extensionId);
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
        await expect(header).toHaveText("Targets");
    });

    test.describe("Items", () => {
        test("Empty", async ({ page }) => {
            // Arrange
            const pom = new TargetsPage(page);

            // Assert
            await pom.empty();
        });

        test("Create one target", async ({ page }) => {
            // Arrange
            const pom = new TargetsPage(page);

            // Act
            await pom.create();

            // Assert
            const firstRow = pom.getRowPom(1);
            await firstRow.id.hasValue("1");
            await firstRow.name.hasValue("target#1");
            await firstRow.pattern.hasValue(".*");
            await firstRow.selector.hasValue("button");
            await firstRow.isActive.isChecked(true);
        });

        test("Unsaved changes", async ({ page }) => {
            // Arrange
            const pom = new TargetsPage(page);

            // Act
            await pom.create();
            const firstRow = pom.getRowPom(1);
            await firstRow.name.setValue("foo");
            await firstRow.pattern.setValue("bar");
            await firstRow.selector.setValue("baz");
            await firstRow.isActive.click();
            await pom.reload();

            // Assert
            await firstRow.id.hasValue("1");
            await firstRow.name.hasValue("target#1");
            await firstRow.pattern.hasValue(".*");
            await firstRow.selector.hasValue("button");
            await firstRow.isActive.isChecked(true);
        });

        test("Saved changes", async ({ page }) => {
            // Arrange
            const pom = new TargetsPage(page);

            // Act
            await pom.create();
            const firstRow = pom.getRowPom(1);
            await firstRow.name.setValue("foo");
            await firstRow.pattern.setValue("bar");
            await firstRow.selector.setValue("baz");
            await firstRow.isActive.click();
            await pom.save();

            // Assert
            await firstRow.id.hasValue("1");
            await firstRow.name.hasValue("foo");
            await firstRow.pattern.hasValue("bar");
            await firstRow.selector.hasValue("baz");
            await firstRow.isActive.isChecked(false);
        });

        test("Three rows", async ({ page }) => {
            // Arrange
            const pom = new TargetsPage(page);

            // Act
            await pom.create();
            await pom.create();
            await pom.create();

            // Assert
            for (let index = 1; index <= 3; index++) {
                const row = pom.getRowPom(index);
                await row.id.hasValue(index.toString());
                await row.name.hasValue(`target#${index}`);
                await row.pattern.hasValue(".*");
                await row.selector.hasValue("button");
                await row.isActive.isChecked(true);
            }
        });
    });
});