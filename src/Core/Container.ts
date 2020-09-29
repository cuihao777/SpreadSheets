import ResizeObserver from 'resize-observer-polyfill';
import throttle from 'lodash/throttle';
import { EventEmitter } from 'events';

interface ContainerOptions {
    width?: number,
    height?: number
}

interface ContainerSize {
    width: number,
    height: number
}

class Container {
    /**
     * Event Manager
     */
    event = new EventEmitter();

    /**
     * Parent Node
     */
    parentNode: HTMLElement = null;

    /**
     * Container Options
     */
    options: ContainerOptions;

    element: HTMLElement;

    viewport: HTMLElement;

    constructor(parentNode: HTMLElement, options: ContainerOptions = {}) {
        const defaultOptions: ContainerOptions = {
            width: -1,
            height: -1
        };

        this.options = { ...defaultOptions, ...options };

        this.element = document.createElement("div");
        this.element.className = "spread-container";
        this.element.style.width = this.options.width !== -1 ? `${this.options.width}px` : '100%';
        this.element.style.height = this.options.height !== -1 ? `${this.options.height}px` : '100%';

        this.parentNode = parentNode;
        parentNode.appendChild(this.element);

        this.onParentNodeResize = throttle(this.onParentNodeResize, 100);
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                this.onParentNodeResize(entry.target as HTMLElement);
            }
        });

        resizeObserver.observe(this.parentNode);

        this.viewport = document.createElement("div");
        this.viewport.className = "viewport";
        this.element.appendChild(this.viewport);
    }

    onParentNodeResize(parentNode: HTMLElement): void {
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

    get viewPortSize(): ContainerSize {
        return {
            width: this.parentNode.clientWidth,
            height: this.parentNode.clientHeight
        };
    }

    appendViewPort(viewPort: HTMLElement): void {
        this.viewport.appendChild(viewPort);
    }
}

export default Container;