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

  const [formState, inputHandler] = useForm(
    {
      file: {
        value: null,
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      }
    },
    false
  );

  const history = useHistory();

  const courseMatrialUploadHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", formState.inputs.file.value);
    formData.append("course", courseID);
    formData.append("fileName", formState.inputs.file.value.name);
    formData.append("fileType", formState.inputs.file.value.type);
    formData.append("description", formState.inputs.description.value);
    console.log(formData.values);
    try {
      await sendRequest(
        `http://localhost:5000/api/courses/upload-course-materials/${courseID}`,
        "POST",
        formData
      );
      history.push("/");
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      <form className="course-form" onSubmit={courseMatrialUploadHandler}>
        {" "}
        {isLoading && <LoadingSpinner asOverlay />}{" "}
        <FileUpload
          center
          id="file"
          onInput={inputHandler}
          errorText="Please provide a file"
        />{" "}
        <Input
          id="description"
          element="input"
          type="text"
          label="Description"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid id."
          onInput={inputHandler}
        />{" "}
        {}{" "}
        <Button type="submit" disabled={!formState.isValid}>
          ADD COURSE MATERIAL{" "}
        </Button>{" "}
      </form>{" "}
    </React.Fragment>
  );
};

export default CourseMaterialUpload;
