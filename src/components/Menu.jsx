import React from "react";
import MenuIcon from './MenuIcon';


export default class Menu extends React.Component {
    menuItems = ['Runtime', 'Sorting', 'Variables']
    render() {
        
        const { toggleState, onStateChange } = this.props;
        return (
                <div className="Menu" onClick = {onStateChange} > 
                    {toggleState ? <MenuIcon /> : <ul> {this.menuItems.map((item, index) => <li key={index}>{item}</li>)}</ul>} 
                
                </div>
            );
        


    }
}