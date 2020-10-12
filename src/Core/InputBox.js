class InputBox {

    /**
     * InputBox Element
     *
     * @type {HTMLElement}
     */
    el = null;

    constructor() {
        this.el = document.createElement("textarea");

        Object.assign(this.el.style, {
            position: 'absolute',
            right: '0',
            top: '0',
            zIndex: '0',
            display: 'none',
            resize: 'none',
            outline: 'none',
            border: '2px solid #4b89ff'
        });
    }

    show() {
        this.el.style.display = 'initial';
    }

    hide() {
        this.el.style.display = 'none';
    }
}

export default InputBox;
