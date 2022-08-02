import React, { useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import FileUpload from "../../shared/components/FormElements/FileUpload";
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./CourseForm.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import axios from "axios";

const CourseMaterialUpload = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const courseID = useParams().courseID;

    const [formState, inputHandler] = useForm({
            file: {
                value: null,
                isValid: false,
            },
        },
        false
    );

    const history = useHistory();

    const courseMatrialUploadHandler = async(event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("file", formState.inputs.file.value);
        formData.append("course", courseID);
        // formData.append("uploader", 123);
        console.log(formData);
        try {
            await sendRequest(
                `http://localhost:5000/api/courses/upload-course-materials/${courseID}`,
                "POST",
                formData
            );
            history.push("/");
        } catch (error) {}
    };

    return ( <
        React.Fragment >
        <
        ErrorModal error = { error }
        onClear = { clearError }
        />{" "} <
        form className = "course-form"
        onSubmit = { courseMatrialUploadHandler } > { " " } { isLoading && < LoadingSpinner asOverlay / > } { " " } <
        FileUpload center id = "file"
        onInput = { inputHandler }
        errorText = "Please provide a file" /
        > { " " } {} { " " } <
        Button type = "submit"
        disabled = {!formState.isValid } >
        ADD COURSE MATERIAL { " " } <
        /Button>{" "} <
        /form>{" "} <
        /React.Fragment>
    );
};

export default CourseMaterialUpload;

// class CourseMaterialUpload extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isLoading: false,
//       error: null,
//       formData: null,
//       courseID: null,
//       file: null,
//       fileName: null,
//       fileType: null,
//       uploader: null,
//     };
//     this.courseID = useParams().courseID;
//     this.history = useHistory();
//     this.onFormSubmit = this.onFormSubmit.bind(this);
//     this.onFileChange = this.onFileChange.bind(this);
//   }
//   onFormSubmit(e) {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("file", this.state.file);
//     formData.append("course", this.courseID);
//     const config = {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     };
//     this.setState({ isLoading: true });
//     axios
//       .post(
//         "http://localhost:5000/api/courses/upload-course-materials/${this.courseID}",
//         formData,
//         config
//       )
//       .then((res) => {
//         this.setState({ isLoading: false });
//         this.history.push("/");
//       })
//       .catch((err) => {
//         this.setState({ isLoading: false });
//         console.log(err);
//       });
//   }

//   onChange(e) {
//     this.setState({ file: e.target.files[0] });
//   }

//   render() {
//     return (
//       <div>
//         <form onSubmit={this.onFormSubmit}>
//           <input type="file" onChange={this.onFileChange} />{" "}
//           <button type="submit"> Upload </button>{" "}
//         </form>{" "}
//         {this.state.isLoading && <LoadingSpinner asOverlay />}{" "}
//       </div>
//     );
//   }
// }

// export default CourseMaterialUpload;