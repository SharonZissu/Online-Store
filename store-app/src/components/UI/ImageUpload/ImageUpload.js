import React, { useRef, useState, useEffect } from 'react';
import Button from '../../UI/Button/Button';

import './ImageUpload.css';

const ImageUpload = props => {

    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef();

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file])

    const pickedHandler = event => {
        let pickedFile;
        let fileIsValid;
        // let fileIsValid = isValid;
        if (event.target.files && event.target.files.length === 1) {
            console.log('YESSSSS');
            pickedFile = event.target.files[0];
            console.log(pickedFile);
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        // props.onInput(props.id, pickedFile, fileIsValid);
        props.onInput(props.id, pickedFile, fileIsValid);
        console.log('After File value in image');
    };

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    return (
        <div className='add-product__entry'>
            <label htmlFor="title"><strong>Image</strong></label>
            <input
                id={props.id}
                ref={filePickerRef}
                type="file"
                style={{ display: 'none' }}
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler} />
            <div className='image-upload'>
                <div className='image-upload__preview'>
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p style={{ textAlign: 'center', verticalAlign: 'middle', marginTop: '2.5rem' }}>Please pick an image</p>}
                </div>
                <Button type='button' addClass='absolute' backgroundColor='black' textColor='white' width='4rem' clicked={pickImageHandler}>Pick</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>)
};

export default ImageUpload;