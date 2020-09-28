class VerticalScrollBar {
    /**
     * Init
     *
     * @param container {Container}
     */
    constructor(container) {
        this.$height = 1;

        this.scrollBar = document.createElement("div");
        this.scrollBar.className = "vscrollbar";
        this.scrollBar.style.position = "absolute";
        this.scrollBar.style.position = "absolute";
        this.scrollBar.style.right = "0";
        this.scrollBar.style.top = "0";
        this.scrollBar.style.bottom = "0";
        this.scrollBar.style.overflow = "auto";

        container.element.appendChild(this.scrollBar);

        this.content = document.createElement("div");
        this.content.style.height = this.$height;
        this.content.style.width = "1px";
        this.scrollBar.appendChild(this.content);

        this.scrollBar.addEventListener("scroll", event => {
            console.log(event.target.scrollTop);
        });
    }

    get visible() {
        const style = getComputedStyle(this.content, null);
        return parseInt(style.width) > 1;
    }

    get height() {
        return this.$height;
    }

    set height(height) {
        this.$height = height;
        this.content.style.height = `${height}px`;
    }

    set top(top) {
        this.scrollBar.scrollTop = top;
    }
}

export default VerticalScrollBar;