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

export class ExecutionOptions extends BasePOM {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        this.automatic = new CheckboxOption(page, OPTIONS.IS_AUTOMATIC_EXECUTION_ENABLED);
        this.logging = new CheckboxOption(page, OPTIONS.IS_EXECUTION_LOGGING_ENABLED);
    }
}

export class AutocloseOptions extends BasePOM {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        this.enabled = new CheckboxOption(page, OPTIONS.IS_AUTOCLOSE_ENABLED);
        this.time = new SelectOption(page, OPTIONS.AUTOCLOSE_TIME);
    }
}

export class OptionsPage extends BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page, extensionId) {
        super(page, extensionId);

        this.execution = new ExecutionOptions(page);
        this.autoclose = new AutocloseOptions(page);

        this.saveButton = page.locator("#save");
        this.pins = page.locator("div.pins");
        this.tabs = page.locator("div.tabs");
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
