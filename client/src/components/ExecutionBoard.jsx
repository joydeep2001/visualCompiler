import React from 'react';

const taskbarStyle = {
    height: '30px',
    widht: '400px'
};

const calsStyle = {
    height: '170px',
    widht: '400px',

};

const collapseStyle = {

};
export default class ExecutionBoard extends React.Component {
    constructor(props) {
        
        super(props);
        this.boardRef = React.createRef();
    }
    state = {
        position: {
            top: 0,
            left: 0
        },
        mouseDown: false
    }
    handleMouseDown = () => {
        this.setState({mouseDown: true})
    }
    handleMouseUp = () => {
        this.setState({mouseDown: false});
    }
    handleDrag = (e) => {
        if(this.state.mouseDown) {
            if(Math.abs(e.nativeEvent.offsetX - this.state.position.left) <= 20 || Math.abs(e.nativeEvent.offsetY - this.state.position.top) <= 20)
                return;
            this.setState({
                    position:{
                        top: e.nativeEvent.offsetY, 
                        left: e.nativeEvent.offsetX
                    }   
                }
            );
            
            
        }
    }
    
    render() {

        let boardStyle = {
            position: 'absolute',
            height: '200px',
            width: '400px',
            top: '0px',
            left: '0px',
            background: '#d43a1c99'
        };

        boardStyle.top = this.state.position.top + 'px';
        boardStyle.left = this.state.position.left + 'px';
        //console.log(boardStyle.top, boardStyle.left);
        return( 
        <div key={'exeBoard'}
            id={'exeBoard'}
            ref={this.boardRef}
            style={boardStyle} 
            onMouseDown={this.handleMouseDown} 
            onMouseMove={this.handleDrag} 
            onMouseUp={this.handleMouseUp}
            // onMouseOut={this.handleMouseUp}
        >
            <div key={'taskbar'} style={taskbarStyle}>
                <button key={'collapse'} style={collapseStyle} onClick={this.props.onMinimize}>Collapse</button>
            </div>
            <div key={'cals'} style={calsStyle}>

            </div>
        </div> 
        )
    }
}