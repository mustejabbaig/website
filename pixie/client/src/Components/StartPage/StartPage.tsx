import React from "react";
import './StartPage.css';
import logo from "../../Components/Menu/pixie_Banner_Final.png";
import screenshot from "./startPage_EditorScreenshot_with_explanations.png";


const StartPage=({}) => {
    return (
        <div id="editorImage" className="container-fluid d-flex flex-column justify-content-center vh-100 bg-warning">
            <div className="row pt-0 mt-0 bg-primary">
                <img
                    src={screenshot}
                    className="img-fluid pt-0 mt-0"
                />
            </div>
        </div>
    );
};

export default StartPage;