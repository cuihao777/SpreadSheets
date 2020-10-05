class HorizontalScrollBar {
    /**
     * Scrollbar HTML-Element
     *
     * @type {HTMLElement}
     */
    el = null;

    constructor() {
        this.el = document.createElement("div");
        this.el.className = "h-scrollbar";

        Object.assign(this.el.style, {
            position: 'absolute',
            right: "0",
            left: "0",
            bottom: "0",
            overflowX: "scroll"
        });

        this.content = document.createElement("div");
        this.content.style.height = `1px`;
        this.content.style.width = `1px`;
        this.el.appendChild(this.content);
    }

    addEventListener(eventName, fn) {
        fn.callback = () => {
            fn.call(this, this.left, this.width);
        };

        this.el.addEventListener(eventName, fn.callback);
    }

    removeEventListener(eventName, fn) {
        fn = fn.callback || fn;
        this.el.removeEventListener(eventName, fn);
    }

    /**
     * Get Content Width
     *
     * @returns {number}
     */
    get width() {
        return this.content.offsetWidth;
    }

    /**
     * Set Content Width
     *
     * @param width {number}
     */
    set width(width) {
        this.content.style.width = `${width}px`;
    }

    /**
     * Get Scrollbar Position
     *
     * @returns {number}
     */
    get left() {
        return this.el.scrollLeft;
    }

    /**
     * Set Scrollbar Position
     *
     * @param left {number}
     */
    set left(left) {
        this.el.scrollLeft = left;
    }
}

export default HorizontalScrollBar;