import './index.scss'
import './index.css'

class HelloWorld {
    constructor() {
        this.element = document.createElement('div');
        document.body.appendChild(this.element);

        setInterval(() => {
            this.render();
        }, 1000);
    }

    render() {
        this.element.innerHTML = new Date().toLocaleString();
    }
}

new HelloWorld();