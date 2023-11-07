const name = "click";
const startIn = "documents";
const getId = (source)=> `${name}-${source}-data`;

export const loadFromFile = async (source) => {
    const [fileHandle] = await window.showOpenFilePicker({
        id: getId(source),
        multiple: false,
        startIn,
        types: [
            {
                description: "JSON documents",
                accept: {
                    "application/json": ".json"
                }
            }
        ],
        excludeAcceptAllOption: false
    });
    const file = await fileHandle.getFile();
    const content = await file.text();
    const data = JSON.parse(content);
    return data;
};

export const saveToFile = async (source, data) => {
    const content = JSON.stringify(data);
    const date = new Date().toISOString().slice(0, 10);
    const suggestedName = `${name}-${source}-${date}.json`;

    const fileHandle = await window.showSaveFilePicker({
        id: getId(source),
        suggestedName,
        startIn,
        types: [
            {
                description: "JSON documents",
                accept: {
                    "application/json": ".json"
                }
            }
        ],
        excludeAcceptAllOption: false
    });
    const file = await fileHandle.createWritable();
    await file.write(content);
    await file.close();
};