import { BasePage } from "./base.js";

export class PopupPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page, extensionId) {
        super(page, extensionId);

        this.message = page.locator("#message");
        this.selected = page.locator("#options > div.selected");
        this.nth = (n) => page.locator(`#opt-${n}`);
    }

    async goto() {
        await super.goto("popup");
    }

    async press(button) {
        await this.page.keyboard.press(button);
    }

    async enter() {
        await this.press("Enter");
    }

    async backspace() {
        await this.press("Backspace");
    }

    async up() {
        await this.press("ArrowUp");
    }

    async down() {
        await this.press("ArrowDown");
    }
}
