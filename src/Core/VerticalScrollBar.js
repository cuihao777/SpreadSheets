class VerticalScrollBar {
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
        this.el.className = "v-scrollbar";

        Object.assign(this.el.style, {
            position: 'absolute',
            right: "0",
            top: "0",
            bottom: "0",
            overflowY: "scroll"
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
     * Get Scrollbar Size
     *
     * @returns {{width: number, height: number}}
     */
    getSize() {
        return this.size;
    }

    /**
     * Set Scrollbar Size
     *
     * @param width {number}
     * @param height {number}
     */
    setSize({width, height}) {
        if (width) {
            this.size.width = width;
        }

        if (height) {
            this.size.height = height;
        }
    }

    /**
     * Get Scrollbar Position
     *
     * @returns {number}
     */
    getTop() {
        return this.el.scrollTop;
    }

    /**
     * Set Scrollbar Position
     *
     * @param top {number}
     */
    setTop(top) {
        this.el.scrollTop = top;
    }
}

export default VerticalScrollBar;