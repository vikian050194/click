import { BasePage, BasePOM } from "./base.js";

class TextOption extends BasePOM {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        this.locator = page;
    }

    async hasValue(value) {
        await this.expect(this.locator).toContainText(value);
    }
}

class InputOption extends BasePOM {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        this.locator = page.locator("input");
    }

    async setValue(value) {
        await this.locator.fill(value);
    }

    async hasValue(value) {
        await this.expect(this.locator).toHaveValue(value);
    }
}

class CheckboxOption extends BasePOM {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        this.locator = page.locator("input");
    }

    async click() {
        await this.locator.click();
    }

    async isChecked(checked = true) {
        await this.expect(this.locator).toBeChecked({ checked });
    }
}

export class TargetRow extends BasePOM {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        this.id = new TextOption(page.locator("td").nth(0));
        this.name = new InputOption(page.locator("td").nth(1));
        this.pattern = new InputOption(page.locator("td").nth(2));
        this.selector = new InputOption(page.locator("td").nth(3));
        this.isActive = new CheckboxOption(page.locator("td").nth(4));
    }
}

export class TargetsPage extends BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page, extensionId) {
        super(page, extensionId);

        this.saveButton = page.locator("#save");
        this.createButton = page.locator("#create");
        this.resetButton = page.locator("#reset");
    }

    async goto() {
        await super.goto("targets");
    }

    async empty() {
        const row = this.page.locator("tbody tr");
        await this.expect(row).toHaveCount(0);
    }

    getRowPom(index) {
        const row = this.page.locator("tr").nth(index);
        const rowPom = new TargetRow(row);
        return rowPom;
    }

    async save() {
        await this.saveButton.click();
    }

    async create() {
        await this.createButton.click();
    }

    async reset() {
        await this.resetButton.click();
    }
}
