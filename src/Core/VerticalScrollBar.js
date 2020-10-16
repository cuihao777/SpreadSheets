class VerticalScrollBar {
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
        this.el.className = "v-scrollbar";

        Object.assign(this.el.style, {
            position: 'absolute',
            right: "0",
            top: "0",
            bottom: "0",
            overflowY: "scroll",
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
                    fn.call(this, self.top, self.height);
                }
            };
        })(this);

        const onMouseWheel = (function () {
            const fn = events['mousewheel'] || emptyFn;
            return (event) => {
                if (event.deltaY !== 0) {
                    event.preventDefault();
                    fn.call(this, null, event.deltaY);
                }
            };
        })();

        const element = this.el;
        element.addEventListener("scroll", onScroll);
        element.addEventListener("mousewheel", onMouseWheel);

        return function remove() {
            element.removeEventListener("scroll", onScroll);
            element.removeEventListener("mousewheel", onMouseWheel);
        };
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
        this.skipScrollEventOnce = true;
        this.el.scrollTop = top;
    }
}

export default VerticalScrollBar;
