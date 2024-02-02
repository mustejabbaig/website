import React, {useState} from 'react';
import './DownloadMenu.css'; //CSS for DMWindow
import {CanvasManager} from '../../Utils/CanvasManager'


// This file contains the logic and structure of the Download PopUp Menue

interface dmProp{
    downloadMenueState: string;
    changeDownloadMenuState: (newDownloadMenuState: string) => void;
    canvas: CanvasManager | null;
}

const DownloadMenu: React.FC<dmProp> = ({downloadMenueState, changeDownloadMenuState, canvas}) => {
    
    const [formData, setFormData] = useState({
        fname: "picture00",
        ftype: "png"
    });

    const changeState = () =>{
        changeDownloadMenuState("downloadMenuHidden");
    }

    const handleChange = (event:any) =>{
        const {name, value} = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const downloadSubmit = (event:any) => {
        event.preventDefault();
        console.log(formData);
        let type = formData.ftype;
        let name = formData.fname;

        if (name === ""){
            name = "picture00";
        }

        canvas!.downloadCanvasToFormats(type, name);
        changeDownloadMenuState("downloadMenuHidden");
      };
    

    return(
        <div className={downloadMenueState}>
            <div className="DM-Box">
            <h4>Download</h4>
                <form onSubmit={downloadSubmit}>
                    <table>
                        <tr>
                            <td>
                                <p>
                                    Filename:
                                </p>
                            </td>
                            <td>
                                <input type="text" name="fname" value={formData.fname} onChange={handleChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    FileType:
                                </p>
                            </td>
                            <td>
                                <table>
                                    <tr>
                                        <td>
                                            <input id="rpng" name="ftype" type='radio' value="png" onChange={handleChange}/>
                                            <label htmlFor='rpng'>PNG</label>
                                        </td>
                                        <td>
                                            <input id="rjpg" name="ftype" type='radio' value="jpg" onChange={handleChange}/>
                                            <label htmlFor='rjpg'>jpg</label>
                                        </td>
                                        <td>
                                            <input id="rgif" name="ftype" type='radio' value="gif" onChange={handleChange}/>
                                            <label htmlFor='rgif'>gif</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                        
                                        </td>
                                        <td>
                                            <input id="rwebp" name="ftype" type='radio' value="webp" onChange={handleChange}/>
                                            <label htmlFor='rwebp'>webp</label> 
                                        </td>
                                        <td>
                                            <input id="ravif" name="ftype" type='radio' value="avif" onChange={handleChange}/>
                                            <label htmlFor='ravif'>avif</label> 
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input id="rpngc" name="ftype" type='radio' value="pngc" onChange={handleChange}/>
                                            <label htmlFor='rpngc'>PNG Compressed</label>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                            <td>
                                <button type='submit'>save</button>
                            </td>
                            <td>
                                <button className='button' type="button" onClick={changeState}>cancel</button>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    );
}

export default DownloadMenu;