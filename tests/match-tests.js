import assert from "node:assert";

import { match } from "../src/common/index.js";

describe("Match", function () {
    it("line is matched", () => {
        const line = "foobar3000";
        const pattern = "bar";

        const actual = match(line, pattern);

        assert.equal(actual, true);
    });

    it("line is not matched", () => {
        const line = "foobar3000";
        const pattern = "baz";

        const actual = match(line, pattern);

        assert.equal(actual, false);
    });

    it("URL is matched", () => {
        const line = "https://example.com/hello/world?page=1";
        const pattern = "example.com/hello";

        const actual = match(line, pattern);

        assert.equal(actual, true);
    });

    it("URL is not matched", () => {
        const line = "https://example.com/hello/world?page=1";
        const pattern = "google.com";

        const actual = match(line, pattern);

        assert.equal(actual, false);
    });
});
