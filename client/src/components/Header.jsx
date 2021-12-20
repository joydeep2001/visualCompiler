import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import Button from '@mui/material/Button';



export default function Header({toggleState, toggleMenuStatus}) {
    const header = {
        display: 'flex',
        
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        justifyContent: 'left',
        alignItems: 'center',
        //boxShadow: '2px 2px grey',
        height: '40px',
        background: '#113f73',
        color: '#fff',
        borderRadius: '0px 0px 20px 20px'
      }
    
    return (
        <>
        
        <header style = {header}>
            <Button onClick={toggleMenuStatus}>
                <ListOutlinedIcon color='primary' fontSize='large'/> 
            </Button>
            <h3>Visual Compiler</h3>
        </header>
        </>
    );
}
