import { OPTIONS } from "../../src/common/constants/index.js";
import { BasePage, BasePOM } from "./base.js";

class CheckboxOption extends BasePOM {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page, id) {
        super(page);

        this.locator = page.locator(`#${id}`);
    }

    async click() {
        await this.locator.click();
    }

    async isChecked(checked = true) {
        await this.expect(this.locator).toBeChecked({ checked });
    }
}

class SelectOption extends BasePOM {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page, id) {
        super(page);

        this.locator = page.locator(`#${id}`);
    }

    async click() {
        await this.locator.click();
    }

    async setValue(value) {
        await this.locator.selectOption(value);
    }

    async hasValue(value) {
        await this.expect(await this.locator.inputValue()).toBe(value);
    }
}

class ExecutionOptions extends BasePOM {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        this.automatic = new CheckboxOption(page, OPTIONS.IS_AUTOMATIC_EXECUTION_ENABLED);
        this.logging = new CheckboxOption(page, OPTIONS.IS_EXECUTION_LOGGING_ENABLED);
    }
}

export class UiOptions extends BasePOM {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        this.fontSize = new SelectOption(page, OPTIONS.UI_FONT_SIZE);
        this.selectedItemColor = new SelectOption(page, OPTIONS.UI_SELECTED_ITEM_COLOR);
        this.selectedItemFontWeight = new SelectOption(page, OPTIONS.UI_SELECTED_ITEM_FONT_WEIGHT);
        this.selectedItemArrow = new CheckboxOption(page, OPTIONS.UI_SELECTED_ITEM_ARROW);
    }
}

class AutocloseOptions extends BasePOM {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        this.enabled = new CheckboxOption(page, OPTIONS.IS_AUTOCLOSE_ENABLED);
        this.time = new SelectOption(page, OPTIONS.AUTOCLOSE_TIME);
    }
}

class ModalPopup extends BasePOM {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        this.modal = page.locator("#modal-one");
        this.title = this.modal.locator("h1");
        this.description = this.modal.locator("div.description");
        this.background = this.modal.locator("div.modal-bg.modal-exit");
        this.closeButton = this.modal.locator("button.modal-close.modal-exit");
    }

    async visible() {
        await this.expect(this.modal).toBeVisible();
    }

    async hidden() {
        await this.expect(this.modal).toBeHidden();
    }

    async exit() {
        await this.background.click({ position: { x: 0, y: 0} });
    }

    async close() {
        await this.closeButton.click();
    }

    async hasTitle() {
        const value = await this.title.innerText;
        await this.expect(value.length).toBeGreaterThan(0);
    }

    async hasDescription() {
        const value = await this.description.innerText;
        await this.expect(value.length).toBeGreaterThan(0);
    }
}

export class OptionsPage extends BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page, extensionId) {
        super(page, extensionId);

        this.execution = new ExecutionOptions(page);
        this.ui = new UiOptions(page);
        this.autoclose = new AutocloseOptions(page);

        this.saveButton = page.locator("#save");
        this.pins = page.locator("div.pins");
        this.tabs = page.locator("div.tabs");

        this.modal = new ModalPopup(page);
    }

    async goto() {
        await super.goto("options");
    }

    async save() {
        await this.saveButton.click();
    }

    getPin(index) {
        return this.pins.locator(`button[pin-id="${index}"]`);
    }

    getTab(index) {
        return this.tabs.locator(`div[tab-id="${index}"]`);
    }
}
