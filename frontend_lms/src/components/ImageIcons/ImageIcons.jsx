import React from 'react';
import "./ImageIcons.css"


const ImageIcons = ({icon, invert}) => {
  return (
    <div className='iconMainDiv'>
        <img src={icon} className={invert? "iconImg invert":"iconImg"}/>
    </div>
  )
}

export default ImageIcons