class VerticalScrollBar {
    /**
     * Scrollbar HTML-Element
     *
     * @type {HTMLElement}
     */
    el = null;

    constructor() {
        this.el = document.createElement("div");
        this.el.className = "v-scrollbar";

        Object.assign(this.el.style, {
            position: 'absolute',
            right: "0",
            top: "0",
            bottom: "0",
            overflowY: "scroll"
        });

        this.content = document.createElement("div");
        this.content.style.height = `1px`;
        this.content.style.width = `1px`;
        this.el.appendChild(this.content);
    }

    addEventListener(eventName, fn) {
        fn.callback = () => {
            fn.call(this, this.el.scrollTop);
        };

        this.el.addEventListener(eventName, fn.callback);
    }

    removeEventListener(eventName, fn) {
        fn = fn.callback || fn;
        this.el.removeEventListener(eventName, fn);
    }

    /**
     * Get Content Height
     *
     * @returns {number}
     */
    get height() {
        return this.content.offsetHeight;
    }

    /**
     * Set Content Height
     *
     * @param height {number}
     */
    set height(height) {
        this.content.style.height = `${height}px`;
    }

    /**
     * Get Scrollbar Position
     *
     * @returns {number}
     */
    get top() {
        return this.el.scrollTop;
    }

    /**
     * Set Scrollbar Position
     *
     * @param top {number}
     */
    set top(top) {
        this.el.scrollTop = top;
    }
}

export default VerticalScrollBar;