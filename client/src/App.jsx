import Body from './components/Body';
import Header from './components/Header';
import React from 'react';


class App extends React.Component{
  state = {
    menuStatus: false
  };
  toggleMenuStatus = () => {
    this.setState((state) => ({menuStatus: !state.menuStatus}));
    console.log(this.state.menuStatus);

  }

  render() {
  return (
  <>
  <Header toggleState={this.state.menuStatus} toggleMenuStatus={this.toggleMenuStatus}/>
  
  <Body toggleState={this.state.menuStatus} toggleMenuStatus={this.toggleMenuStatus}/>
  </>
  
  );
  }
}
export default App;
