import React from 'react';
import Menu from './Menu';



export default class Body extends React.Component{
    state = {
        menuStatus: false
    };
    componentDidUpdate() {
        
    }
    toggleMenuStatus = () => {
        this.setState({menuStatus: !this.state.menuStatus});
        console.log(this.state.menuStatus);

    }

    render() {
            return (
            <div className="body">
                <Menu toggleState = {this.state.menuStatus} onStateChange = {this.toggleMenuStatus}/>
                <div className="contains">
                    Contains
                </div>

            </div>
        );
    }
}

