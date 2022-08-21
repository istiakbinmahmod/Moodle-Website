import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";
import "./FileUpload.css";

const FileUpload = (props) => {
  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickFileHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt, .rtf"
        onChange={pickedHandler}
      />{" "}
      <div className={`file-upload ${props.center && "center"}`}>
        <Button type="button" onClick={pickFileHandler}>
          PICK FILE{" "}
        </Button>{" "}
      </div>{" "}
      {!isValid && <p> {props.errorText} </p>}{" "}
    </div>
  );
};

export default FileUpload;
