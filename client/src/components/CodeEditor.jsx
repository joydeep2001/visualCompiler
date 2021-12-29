import react from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import '../customStyle.css'

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
    const highlightLines = (editor, start, end) => {
        console.log('high');
        const from = {line: 1, ch: 1};
        const to = {line: 3, ch: 3};
        editor.markText(from, to, {className: "codemirror-highlighted"});
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
                        
                         
                    }
                }
                
                selection={{
                    ranges: [{
                      anchor: {ch: 1, line: 1},
                      head: {ch: 3, line: 3}
                    }],
                    focus: true // defaults false if not specified
                  }}
                  onSelection={(editor, data) => {highlightLines(editor, 0, 0)}}
                
                />
            </div>
    );
}