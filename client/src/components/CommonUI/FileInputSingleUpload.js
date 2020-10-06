import React from 'react';

const FileInputSingleUpload = (props) => {
    console.log(props);
    return (
        <div className="file-input-single-upload-container">
            <input id="bookCoverPhoto" className="file-input-single-upload-field" name="bookCoverPhoto" type="file" onClick={(event) => { console.log(event.currentTarget.files[0]) }} onChange={(event) => {
                setFieldValue("bookCoverPhoto", event.currentTarget.files[0]);
            }} />
            <label tabIndex="0" htmlFor="bookCoverPhoto" className="file-input-single-upload-trigger">Select Book Cover Photo</label>
            <div className="file-input-single-upload-name">{singleUpoadFileFieldValue()}</div>
        </div>
    );
}

export default FileInputSingleUpload
