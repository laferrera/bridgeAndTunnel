// https://stackblitz.com/edit/react-m2l1cn?file=src%2FApp.js,src%2Fcomponents%2FNotes.js
import React from 'react';
import SelectDemo from "./select.jsx";

function Panel({ node }) {

    const onValueChange = (val) => {
        console.log(val);
    }

    return (
        <div>
            Panel
            <SelectDemo 
                value='leek'
                onValueChange={onValueChange}
            />
            <p>{node.id}</p>
            <p>{node.name}</p>
        </div>
    )

}

export default Panel;
