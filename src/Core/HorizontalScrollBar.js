class HorizontalScrollBar {
    /**
     * Scrollbar HTML-Element
     *
     * @type {HTMLElement}
     */
    el = null;

    /**
     * Skip scroll event once.
     *
     * @type {boolean}
     */
    skipScrollEventOnce = false;

    constructor() {
        this.el = document.createElement("div");
        this.el.className = "h-scrollbar";

        Object.assign(this.el.style, {
            position: 'absolute',
            right: "0",
            left: "0",
            bottom: "0",
            overflowX: "scroll",
            zIndex: "1"
        });

        this.content = document.createElement("div");
        this.content.style.height = `1px`;
        this.content.style.width = `1px`;
        this.el.appendChild(this.content);
    }

    addEventListener(events) {
        const emptyFn = () => undefined;

        const onScroll = (function (self) {
            const fn = events['scroll'] || emptyFn;
            const isSkip = () => self.skipScrollEventOnce;
            const restore = () => self.skipScrollEventOnce = false;

            return (event) => {
                if (isSkip()) {
                    restore();
                } else {
                    event.preventDefault();
                    fn.call(this, self.left, self.width);
                }
            };
        })(this);

        const element = this.el;
        element.addEventListener("scroll", onScroll);

        return function remove() {
            element.removeEventListener("scroll", onScroll);
        };
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
        this.skipScrollEventOnce = true;
        this.el.scrollLeft = left;
    }
}

export default HorizontalScrollBar;
