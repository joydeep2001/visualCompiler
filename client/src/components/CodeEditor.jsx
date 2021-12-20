import react from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import { Controlled as ControlledEditor } from 'react-codemirror2';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/javascript/javascript';

const codewrapper = {
    height: '300px'
}

export default function CodeEditor(props) {
    const {
        language,
        value,
        onChange
    } = props;
    function handleChange(editor, data, value) {
        onChange(value);
    }
    return (
            <div key={'codewrapper'} style={codewrapper}>
                
                <ControlledEditor 
                key={'mainEditor'}
                onBeforeChange={handleChange}
                value={value}
                className=''
                options={
                    {
                        lineWrapping: true,
                        lint: true,
                        mode: language,
                        lineNumbers: true,
                        theme: 'material'
                        
                    }
                }
                
                />
            </div>
    );
}