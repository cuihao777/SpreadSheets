import './css/index.scss'
import { watcher } from './Clipboard/Watcher'
import React, { useEffect, useState } from 'react'
import { render } from 'react-dom'

const Hello = React.memo(() => {
    const [data, setData] = useState([]);

    useEffect(() => {
        watcher(data => {
            setData(data);
        });
    }, []);

    return (
        <table class="test">
            <tbody>
            {data.map(row => (
                <tr>
                    {row.map(cell => <td>{cell}</td>)}
                </tr>
            ))}
            </tbody>
        </table>
    );
});

render(<Hello/>, document.body);