import Events from 'events';

class InputBox {

    /**
     * InputBox Element
     *
     * @type {HTMLTextAreaElement}
     */
    el = null;

    /**
     * Last modified cell's index
     *
     * @type {{column: number, row: number}}
     */
    lastIndex = {
        row: -1,
        column: -1
    };

    /**
     * Event Manager
     *
     * @type {EventEmitter}
     */
    events = new Events();

    constructor() {
        this.el = document.createElement("textarea");

        Object.assign(this.el.style, {
            position: 'absolute',
            right: '0',
            top: '0',
            zIndex: '0',
            display: 'none',
            resize: 'none',
            outline: 'none',
            border: '2px solid #4b89ff',
            boxSizing: 'border-box'
        });
    }

    get value() {
        return this.el.value;
    }

    set value(v) {
        this.el.value = v;
    }

    get visible() {
        return this.el.style.display !== 'none';
    }

    attr({ x, y, width, height }) {
        if (x !== undefined) {
            this.el.style.left = `${x - 1}px`;
        }
        if (y !== undefined) {
            this.el.style.top = `${y - 1}px`;
        }
        if (width !== undefined) {
            this.el.style.width = `${width + 2}px`;
        }
        if (height !== undefined) {
            this.el.style.height = `${height + 2}px`;
        }
    }

    show(rowIndex, columnIndex) {
        this.lastIndex.row = rowIndex;
        this.lastIndex.column = columnIndex;
        this.el.style.display = '';
        this.el.focus();
    }

    save() {
        const { row, column } = this.lastIndex;
        this.events.emit("save", this.value, row, column);
    }

    close() {
        this.el.style.display = 'none';
    }

    addEventListener(events) {
        const emptyFn = () => undefined;
        const self = this;

        const onClose = (function () {
            const fn = events['save'] || emptyFn;
            return (value, row, column) => {
                fn.call(self, value, row, column);
            };
        })();

        const onKeydown = function (event) {
            if (event.keyCode === 27) {
                // ESC
                event.preventDefault();
                self.close();
            } else if (event.altKey && event.keyCode === 13) {
                // ALT + ENTER
                event.preventDefault();
                // TODO: 换行
            } else if (event.keyCode === 13) {
                // ENTER
                event.preventDefault();
                self.save();
                self.close();
            }
        };

        self.events.on("save", onClose);
        self.el.addEventListener("keydown", onKeydown);

        return function remove() {
            self.events.off("save", onClose);
            self.el.removeEventListener("keydown", onKeydown);
        };
    }
}

export default InputBox;
