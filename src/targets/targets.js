import {
    Local,
    Target,
    TARGETS,
    dom
} from "../common/index.js";

document.addEventListener("DOMContentLoaded", async () => {
    const $root = document.getElementById("root");

    const rows = await Local.get(TARGETS.TARGETS);
    const newId = rows.reduce((max, { id }) => max < id ? id : max, 0) + 1;

    const columns = [
        new dom.Column("id", "#", false),
        new dom.Column("name", "name", true),
        new dom.Column("pattern", "pattern", true),
        new dom.Column("selector", "selector", true),
        new dom.Column("isActive", "active", true)
    ];

    const $table = dom.makeTable(columns, rows);
    $root.append($table);

    const $createButton = document.getElementById("create");
    $createButton.addEventListener("click", async () => {
        rows.push(new Target(newId, `target#${newId}`, ".*", "button", true));
        await Local.set(TARGETS.TARGETS, rows);
        location.reload();
    });

    const $saveButton = document.getElementById("save");
    $saveButton.addEventListener("click", async () => {
        await Local.set(TARGETS.TARGETS, rows);
        location.reload();
    });

    const $resetButton = document.getElementById("reset");
    $resetButton.addEventListener("click", async () => {
        await Local.set(TARGETS.TARGETS, []);
        location.reload();
    });
});
