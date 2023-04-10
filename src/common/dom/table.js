import { makeElement, makeElementCreator } from "./element.js";

export class Column {
    constructor(key, title, editable = false) {
        this.key = key;
        this.title = title;
        this.editable = editable;
    }
}

const makeTr = makeElementCreator("tr");
const makeTd = makeElementCreator("td");
const makeInput = makeElementCreator("input");

export const makeTable = (columns, collection) => {
    const table = makeElement("table");

    const head = makeElement("thead");
    const body = makeElement("tbody");

    table.appendChild(head);
    table.appendChild(body);

    const headRow = makeTr();
    head.appendChild(headRow);
    for (const { title } of columns) {
        const column = makeElement("th", { text: title });
        headRow.appendChild(column);
    }

    for (const item of collection) {
        const row = makeTr();
        body.appendChild(row);
        for (const { key, editable } of columns) {
            if (editable) {
                if(typeof(item[key]) === typeof(true)){
                    const type = "checkbox";
                    const input = makeInput({type});
                    input.checked = item[key];
                    input.addEventListener("change", (e) => {
                        item[key] = e.target.checked;
                    });
                    const td = makeTd();
                    td.appendChild(input);
                    row.appendChild(td);
                } else {
                    const type = "text";
                    const input = makeInput({type});
                    input.value = item[key];
                    input.addEventListener("change", (e) => {
                        item[key] = e.target.value;
                    });
                    const td = makeTd();
                    td.appendChild(input);
                    row.appendChild(td);
                }
            } else {
                const td = makeTd({ text: item[key] });
                row.appendChild(td);
            }
        }
    }

    return table;
};
