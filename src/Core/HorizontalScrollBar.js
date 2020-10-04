class HorizontalScrollBar {
    /**
     * Scrollbar HTML-Element
     *
     * @type {HTMLElement}
     */
    el = null;

    /**
     * Scrollbar Size
     *
     * @type {{width: number, height: number}}
     */
    size = {
        width: 1,
        height: 1
    };

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
        this.content.style.height = `${this.size.height}px`;
        this.content.style.width = `${this.size.width}px`;
        this.el.appendChild(this.content);

        this.el.addEventListener("scroll", event => {
            console.log(event.target.scrollTop);
        });
    }

    /**
     * Get Content Width
     *
     * @returns {number}
     */
    getWidth() {
        return this.size.width;
    }

    /**
     * Set Content Width
     *
     * @param width {number}
     */
    setWidth(width) {
        this.size.width = width;
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