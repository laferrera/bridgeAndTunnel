import * as React from 'react';
import * as ReactDOM from 'react-dom';

function render() {
    ReactDOM.render(<div class="editor">
        <div className="container">
            hi
            <div className="node-editor" id="rete"></div>
        </div>
        <div className="dock"></div>
    </div>, document.body);
}

render();
