import { parse } from './Parser'

export function watcher(fn, element = document.body) {
    function onPaste(event) {
        const { clipboardData } = event;

        for (let i = 0; i < clipboardData.items.length; i++) {
            const item = clipboardData.items[i];

            if (item.type === "text/plain") {
                if (typeof fn === "function") {
                    const data = clipboardData.getData(item.type);
                    fn(parse(data));
                }
                break;
            }
        }
    }

    element.addEventListener("paste", onPaste);

    return () => {
        element.removeEventListener("paste", onPaste);
    }
}