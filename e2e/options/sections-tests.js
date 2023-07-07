import { test, timeout } from "../fixtures.js";
import { OptionsPage } from "../pom/index.js";

test.describe("Sections", () => {
    test.beforeEach(async ({ page, extensionId }) => {
        await page.waitForTimeout(timeout * 2);

        const pom = new OptionsPage(page, extensionId);
        await pom.goto();
    });

    test("Execution", async ({ page }) => {
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

    test("Appearance", async ({ page }) => {
        // Arrange
        const pom = new OptionsPage(page);

        await pom.ui.fontSize.hasValue("12");
        await pom.ui.selectedItemColor.hasValue("#EC4339");
        await pom.ui.selectedItemFontWeight.hasValue("bold");

        // Act
        await pom.getPin(2).click();
        await pom.ui.fontSize.setValue("8");
        await pom.ui.selectedItemColor.setValue("#00A0DC");
        await pom.ui.selectedItemFontWeight.setValue("normal");

        await pom.save();
        await pom.reload();

        // Assert
        await pom.ui.fontSize.hasValue("8");
        await pom.ui.selectedItemColor.hasValue("#00A0DC");
        await pom.ui.selectedItemFontWeight.hasValue("normal");
    });

    test("Autoclose", async ({ page }) => {
        // Arrange
        const pom = new OptionsPage(page);
        await pom.getPin(3).click();

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