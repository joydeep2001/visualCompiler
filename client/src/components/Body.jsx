import React from 'react';
import Menu from './Menu';
import CodeEditor from './CodeEditor';
import OutputBox from './OutputBox';
import ToolBar from './ToolBar';
import Runtime from './runtime/Runtime';
import ExecutionBoard from './ExecutionBoard';

const containStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex'
   
    
};
const divider = {
    height: '30px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '5px',
    fontWeight: 'bold',
};

const codeEditorWrapper =  { 
    flex: '2',
    flexBasis: '0',
    display: 'flex',
    flexDirection: 'column'
}

const visualsWrap =  { 
    flex: '3',
    flexBasis: '0',
    display: 'flex',
    flexDirection: 'column'
    
    
};
const visuals = {
    position: 'relative',
    height: '100%',
    width: '100%',
    top: '0',
    left: '0'
}

export default class Body extends React.Component{
    state = {
        code: '',
        language: 'text',
        ExeBoard: false
    }

    handleChange = (val) => {
        this.setState((state) => {
            return (
                state.code = val
            )
        });
        // console.log(this.state.value);
    }
    componentDidUpdate() {
        
    }
    handleSelect = (language) => {
        this.setState({language});
        console.log(this.state.language);
    }
    handleExeBoardToggle = () => {
        this.setState(() => ({ExeBoard : !this.state.ExeBoard}))
    }
    handleRunCode = async() => {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors', 
            cache: 'no-cache', 
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
              
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer', 
            body: this.state.code 
          });
    }
    
    render() {
             const {toggleState, toggleMenuStatus} = this.props;
             const items = [1, 2, 3];
            return (
            <>
            <ToolBar 
                onSelect = {this.handleSelect}
                onMaximize={this.handleExeBoardToggle}
                onRun={this.handleRunCode}
            />
            <div className="body" key={'body'} >
                <div key={'contains'} style={containStyle}>
                    <div key={'codeEditorWrapper'} style={codeEditorWrapper}> 
                        <CodeEditor 
                            value={this.state.code} 
                            onChange={this.handleChange}
                            language={this.state.language}
                        />
                        <div key={'divider'} style={divider}>
                            Output
                        </div>
                        <OutputBox />
                    </div>

                    <div key={'visualsWrap'} style={visualsWrap}>
                        <div key={'visual'} style={visuals}>
                            <Runtime />
                            { this.state.ExeBoard ?  <ExecutionBoard onMinimize={this.handleExeBoardToggle} /> : <></>}
                        </div>
                        
                    </div>

                </div>
                
                {toggleState ? <Menu items toggleMenuStatus={toggleMenuStatus}/> : <></>}
            </div>

           </>
        );
    }
}

