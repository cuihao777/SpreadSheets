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

        this.el.addEventListener("scroll", event => {
            console.log(event.target.scrollTop);
        });
    }

    /**
     * Get Content Height
     *
     * @returns {number}
     */
    getHeight() {
        return this.content.offsetHeight;
    }

    /**
     * Set Content Height
     *
     * @param height {number}
     */
    setHeight(height) {
        this.content.style.height = `${height}px`;
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