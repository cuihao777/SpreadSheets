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

        this.el.addEventListener("scroll", event => {
            console.log(event.target.scrollLeft);
        });
    }

    /**
     * Get Content Width
     *
     * @returns {number}
     */
    getWidth() {
        return this.content.offsetWidth;
    }

    /**
     * Set Content Width
     *
     * @param width {number}
     */
    setWidth(width) {
        this.content.style.width = `${width}px`;
    }

    /**
     * Get Scrollbar Position
     *
     * @returns {number}
     */
    getLeft() {
        return this.el.scrollLeft;
    }

    /**
     * Set Scrollbar Position
     *
     * @param left {number}
     */
    setLeft(left) {
        this.el.scrollLeft = left;
    }
}

export default HorizontalScrollBar;