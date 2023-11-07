import { test, timeout } from "../fixtures.js";
import { TargetsPage } from "../pom/index.js";

test.describe("File", () => {
    test.beforeEach(async ({ page, extensionId, context }) => {
        await page.waitForTimeout(timeout * 2);

        // TODO handle changelog automatic opening somehow else
        await context.pages()[0].close();
        await context.pages()[1].close();

        const pom = new TargetsPage(page, extensionId);
        await pom.goto();
    });

    test("Save and load", async ({ page, extensionId }) => {
        // Arrange
        const pom = new TargetsPage(page, extensionId);

        // Act
        await pom.create();
        const firstRow = pom.getRowPom(1);
        await firstRow.name.setValue("foo");
        await firstRow.pattern.setValue("bar");
        await firstRow.selector.setValue("baz");
        await firstRow.isActive.click();
        await firstRow.isAuto.click();
        await pom.save();

        await page.addInitScript(() => {
            window.showOpenFilePicker = async () => {
                return await [{
                    getFile: async () => {
                        return await {
                            text: async () => {
                                return await localStorage.getItem("file");
                            }
                        };
                    }
                }];
            };
            window.showSaveFilePicker = async () => {
                return await {
                    createWritable: async () => {
                        return await {
                            write: async (content) => {
                                await localStorage.setItem("file", content);
                            },
                            close: async () => {
    
                            }
                        };
                    }
                };
            };
        });

        await pom.goto();

        await pom.fileSaveButton.click();

        await pom.reset();

        await pom.fileLoadButton.click();

        // Assert
        await firstRow.id.hasValue("1");
        await firstRow.name.hasValue("foo");
        await firstRow.pattern.hasValue("bar");
        await firstRow.selector.hasValue("baz");
        await firstRow.isActive.isChecked(false);
        await firstRow.isAuto.isChecked(true);
    });
});