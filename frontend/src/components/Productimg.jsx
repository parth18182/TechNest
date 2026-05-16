import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
function Productimg({ images }) {

    const [mainImg, setMainImg] = useState(images[0].url);

    return (
        <div className='flex gap-5 w-max'>
            <div className='gap-5 flex flex-col'>
                {
                    images.map((img) => {
                        return <img src={img.url} onClick={() => setMainImg(img.url)} alt="" className='cursor-pointer w-20 h-20 border shadow-lg' />
                    })
                }
            </div>
            <Zoom>
                <img src={mainImg} className='w-125 border shadow-lg' alt="" />
            </Zoom>
        </div>
    )
}
export default Productimg