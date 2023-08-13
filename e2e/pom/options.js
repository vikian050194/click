import { OPTIONS } from "../../src/common/constants/index.js";
import { BasePage, BasePOM } from "./base.js";
import { ModalPopup } from "./modal.js";

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

export class ChangelogOptions extends BasePOM {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        this.show = new CheckboxOption(page, OPTIONS.CHANGELOG_SHOW);
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
        this.changelog = new ChangelogOptions(page);

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
