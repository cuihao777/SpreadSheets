import './css/index.scss'
import { watcher } from './Clipboard/Watcher'
import React, { useEffect, useState } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

const Hello = React.memo(() => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const stop = watcher(data => {
            setData(data);
        });

        return () => stop();
    }, []);

    return (
        <table className="test">
            <tbody>
            {data.map((row, index) => (
                <tr key={index}>
                    {row.map((cell, index) => <td key={index}>{cell}</td>)}
                </tr>
            ))}
            </tbody>
        </table>
    );
});

const root = document.createElement('root');
document.body.appendChild(root);
render(<Hello/>, root);

const button = document.createElement('button');
button.innerText = "destroy";
button.addEventListener("click", () => {
    unmountComponentAtNode(root);
});
root.appendChild(button);