class SpreadSheets {
    size = {
        width: 0,
        height: 0
    };

    constructor(options = {}) {
        const defaultOptions = {
            width: 'auto',
            height: 'auto'
        };

        this.options = {
            ...defaultOptions,
            ...options
        };

        this.parentElement = document.querySelector(this.options.element);
        this.parentElement.style.position = "relative";

        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "0";
        container.style.right = "0";
        container.style.bottom = "0";
        container.style.top = "0";
        container.style.overflow = "hidden";
        this.parentElement.appendChild(container);

        this.size.width = this.options.width === 'auto' ? container.offsetWidth : parseInt(this.options.width);
        this.size.height = this.options.height === 'auto' ? container.offsetHeight : parseInt(this.options.height);

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        this.context = this.canvas.getContext('2d');

        container.appendChild(this.canvas);
        this.container = container;
    }

}

export default SpreadSheets;