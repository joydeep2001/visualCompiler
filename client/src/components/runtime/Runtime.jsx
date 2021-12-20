import ActivationRecord from "./ActivationRecord";
import './runtime.css';

export default function Runtime() {
    return (
        <div className="visualWrapper" key={'visualWrapper'}>
            <div key={'callstack'}>
                {/* <ActivationRecord /> */}
            </div>
            <div className="heap" key={'heap'}></div>
            <div className="data" key={'data'}></div>
            <div className="bss" key={'bss'}></div>
        </div>
    );
}