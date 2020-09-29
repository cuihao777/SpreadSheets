import Container from "./Container";

class VerticalScrollBar {
    $height: number;
    scrollBar: HTMLElement;
    content: HTMLElement;

    constructor(container: Container) {
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
        this.content.style.height = `${this.$height}px`;
        this.content.style.width = "1px";
        this.scrollBar.appendChild(this.content);

        this.scrollBar.addEventListener("scroll", () => {
            console.log(this.scrollBar.scrollTop);
        });
    }

    get visible(): boolean {
        const style = getComputedStyle(this.content, null);
        return parseInt(style.width) > 1;
    }

    get height(): number {
        return this.$height;
    }

    set height(height: number) {
        this.$height = height;
        this.content.style.height = `${height}px`;
    }

    set top(top: number) {
        this.scrollBar.scrollTop = top;
    }
}

export default VerticalScrollBar;