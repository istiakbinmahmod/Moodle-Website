import React, { useRef, useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../../../firebase";
import Button from "./Button";
import "./FileUpload.css";
// import { ref, uploadBytesResumable } from "firebase/storage";
let fileurl = "";
// const setFileurl = (url) => {
//   fileurl = url;
// };

const FileUpload = (props) => {
  
  const [file, setFile, setFileurl] = useState();
  //   const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const [ isvalidURL, setIsvalidURL ] = useState(false);

  const filePickerRef = useRef();

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];


      const storageRef = ref(storage, `/files/${pickedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, pickedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          // setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);
            // fileurl = url;
            // console.log("stuck1");
            // localStorage.setItem("fileurl", url);
            // console.log("stuck2");
          });
        }
      );
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;

      console.log("stuck3");
     
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    // props.onInput(fileurl, pickedFile, fileIsValid);
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickFileHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        // id={fileurl}
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

