import ResizeObserver from 'resize-observer-polyfill';
import throttle from 'lodash/throttle';
import Events from 'events';

class Container {
    /**
     * Event Manager
     *
     * @type {EventEmitter}
     */
    event = new Events();

    /**
     * Parent Node
     *
     * @type {HTMLElement}
     */
    parentNode = null;

    constructor(parentNode, options) {
        const defaultOptions = {
            width: -1,
            height: -1
        };

        this.options = { ...defaultOptions, ...options };

        this.element = document.createElement("div");
        this.element.className = "spread-container";
        this.element.style.width = this.options.width !== -1 ? this.options.width : '100%';
        this.element.style.height = this.options.height !== -1 ? this.options.height : '100%';

        this.parentNode = parentNode;
        parentNode.appendChild(this.element);

        this.onParentNodeResize = throttle(this.onParentNodeResize, 100);
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                this.onParentNodeResize(entry.target);
            }
        });

        resizeObserver.observe(this.parentNode);

        this.viewport = document.createElement("div");
        this.viewport.className = "viewport";
        this.element.appendChild(this.viewport);
    }

    onParentNodeResize(parentNode) {
        const clientWidth = parentNode.clientWidth;
        const clientHeight = parentNode.clientHeight;

        const params = {
            viewPort: {
                width: clientWidth,
                height: clientHeight
            }
        };

        this.event.emit("resize", params);
    }

    get viewPortSize() {
        return {
            width: this.parentNode.clientWidth,
            height: this.parentNode.clientHeight
        };
    }

    appendViewPort(viewPort) {
        this.viewport.appendChild(viewPort);
    }
}

export default Container;