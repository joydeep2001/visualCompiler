import Body from './components/Body';

const header = {
  display: 'flex',
  justifyContent: 'center',
  fontFamily: 'sans-serif',
}


function App() {
  return (
  <>
   <header style = {header}>
     <h1>Visual Compiler</h1>
   </header>
  <Body />

  </>
  
  );
}
export default App;
