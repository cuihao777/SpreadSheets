import Events from 'events';

class InputBox {

    /**
     * InputBox Container Element
     *
     * @type {HTMLDivElement}
     */
    el = null;

    /**
     * InputBox Element
     *
     * @type {HTMLTextAreaElement}
     */
    textareaEl = null;

    /**
     * Measurement Element
     *
     * @type {HTMLPreElement}
     */
    measurementEl = null;

    /**
     * Initial Information
     *
     * @type {{rowIndex: number, columnIndex: number, width: number, maxWidth: number, height: number, maxHeight: number}}
     */
    initial = {
        rowIndex: -1,
        columnIndex: -1,
        width: -1,
        maxWidth: -1,
        height: -1,
        maxHeight: -1,
        value: -1
    };

    /**
     * Event Manager
     *
     * @type {EventEmitter}
     */
    events = new Events();

    constructor() {
        this.el = document.createElement("div");

        Object.assign(this.el.style, {
            position: 'absolute',
            right: '0',
            top: '0',
            zIndex: '0',
            display: 'none',
            border: '2px solid #4b89ff',
            boxSizing: 'border-box',
            overflow: 'hidden'
        });

        this.textareaEl = document.createElement("textarea");

        Object.assign(this.textareaEl.style, {
            position: 'absolute',
            left: '0',
            top: '0',
            zIndex: '0',
            resize: 'none',
            outline: 'none',
            border: '0',
            boxSizing: 'border-box',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            margin: '0',
            padding: '0',
            fontSize: '13px'
        });

        this.measurementEl = document.createElement("pre");

        Object.assign(this.measurementEl.style, {
            position: 'absolute',
            border: '0',
            boxSizing: 'border-box',
            margin: '0',
            padding: '0',
            fontSize: '13px',
            left: '-9999px',
            top: '-9999px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
        });

        this.el.appendChild(this.textareaEl);
        this.el.appendChild(this.measurementEl);
    }

    get value() {
        return this.textareaEl.value;
    }

    set value(v) {
        if (v === undefined || v === null) {
            this.textareaEl.value = '';
        } else {
            this.textareaEl.value = v;
        }
    }

    get visible() {
        return this.el.style.display !== 'none';
    }

    init(value, { x, y, width, height, maxWidth, maxHeight }, { rowIndex, columnIndex }) {
        this.initial = { rowIndex, columnIndex, width, height, maxWidth, maxHeight, value };

        this.el.style.left = `${x - 1}px`;
        this.el.style.top = `${y - 1}px`;

        this.el.style.width = `${width + 1}px`;
        this.textareaEl.style.width = `${width - 3}px`;
        this.measurementEl.style.maxWidth = `${maxWidth - 3}px`;

        this.el.style.height = `${height + 1}px`;
        this.textareaEl.style.height = `${height - 3}px`;
        this.measurementEl.style.maxHeight = `${maxHeight - 3}px`;

        this.textareaEl.value = value;
    }

    show() {
        this.el.style.display = '';
        this.resize();

        const lastIndex = this.textareaEl.value.length;
        this.textareaEl.scrollTop = 0;
        this.textareaEl.setSelectionRange(lastIndex, lastIndex);
        this.textareaEl.focus();
    }

    save() {
        const { rowIndex, columnIndex, value } = this.initial;

        if (this.value !== value) {
            this.events.emit("save", this.value, rowIndex, columnIndex);
        }
    }

    close() {
        this.el.style.display = 'none';
        this.events.emit("close");
    }

    resize() {
        let value = this.value;
        value += (value !== '' && value.substr(-1) === '\n' ? ' ' : '');
        this.measurementEl.innerHTML = value;

        const minWidth = this.initial.width;
        const minHeight = this.initial.height;
        const maxWidth = this.initial.maxWidth;
        const maxHeight = this.initial.maxHeight;

        let width = this.measurementEl.offsetWidth + 6;
        let height = this.measurementEl.offsetHeight + 6;

        width = width < minWidth ? minWidth : (width > maxWidth ? maxWidth : width);
        height = height < minHeight ? minHeight : (height > maxHeight ? maxHeight : height);

        this.el.style.width = `${width + 1}px`;
        this.textareaEl.style.width = `${width - 3}px`;
        this.el.style.height = `${height + 1}px`;
        this.textareaEl.style.height = `${height - 3}px`;
    }

    addEventListener(events) {
        const emptyFn = () => undefined;
        const self = this;

        const onSave = (function () {
            const fn = events['save'] || emptyFn;
            return (value, row, column) => {
                fn.call(self, value, row, column);
            };
        })();

        const onClose = (function () {
            const fn = events['close'] || emptyFn;
            return () => {
                fn.call(self);
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
                const { selectionStart, selectionEnd } = self.textareaEl;
                self.textareaEl.setRangeText("\n", selectionStart, selectionEnd);
                self.textareaEl.setSelectionRange(selectionStart + 1, selectionStart + 1);
                self.textareaEl.dispatchEvent(new Event('input'));
            } else if (event.keyCode === 13) {
                // ENTER
                event.preventDefault();
                self.save();
                self.close();
            }
        };

        const onInput = function () {
            self.resize();
        };

        const onMousedown = function (event) {
            if (self.visible && event.target !== self.textareaEl) {
                self.save();
                self.close();
            }
        };

        self.events.on("save", onSave);
        self.events.on("close", onClose);
        self.textareaEl.addEventListener("keydown", onKeydown);
        self.textareaEl.addEventListener("input", onInput);
        document.addEventListener("mousedown", onMousedown);

        return function remove() {
            self.events.off("save", onSave);
            self.events.off("close", onClose);
            self.textareaEl.removeEventListener("keydown", onKeydown);
            self.textareaEl.removeEventListener("input", onInput);
            document.removeEventListener("mousedown", onMousedown);
        };
    }
}

export default InputBox;
