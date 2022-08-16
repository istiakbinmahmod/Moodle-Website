import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
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
import { AuthContext } from "../../shared/context/auth-context";

const CourseMaterialUpload = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const courseID = useParams().courseID;

  const [formState, inputHandler] = useForm(
    {
      file: {
        value: null,
        isValid: false,
      },
      title: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const [formState2, inputHandler2] = useForm(
    {
      file2: {
        value: null,
        isValid: false,
      },
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      dueDate: {
        value: Date.now(),
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const courseMatrialUploadHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();

      formData.append("file", formState.inputs.file.value);

      formData.append("course", courseID);

      formData.append("title", formState.inputs.title.value);

      console.log(formData);
      await sendRequest(
        `http://localhost:5000/api/teachers/upload-material/${courseID}`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (error) {}
  };

  const courseAssignmentUploadHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", formState2.inputs.file2.value);
      formData.append("course", courseID);
      formData.append("title", formState2.inputs.title.value);
      formData.append("description", formState2.inputs.description.value);
      formData.append("dueDate", formState2.inputs.dueDate.value);

      await sendRequest(
        `http://localhost:5000/api/teachers/upload-course-assignment/${courseID}`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (error) {}
  };

  const [loadedCourseMaterials, setLoadedCourseMaterials] = useState();

  useEffect(() => {
    const fetchCourseMaterials = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/teachers/get-materials/${courseID}`
        );

        setLoadedCourseMaterials(responseData.courseMaterials);
      } catch (err) {}
    };
    fetchCourseMaterials();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      {loadedCourseMaterials &&
        loadedCourseMaterials.map((mat) => {
          return (
            <div className="center">
              <Button to={`/course-materials/${mat._id}`}>
              <a href={mat.file}> {mat.title} </a>
              </Button>
              {" "}
            </div>
          );
        })}{" "}
      <form className="course-form" onSubmit={courseMatrialUploadHandler}>
        {" "}
        {isLoading && <LoadingSpinner asOverlay />}{" "}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />{" "}
        <FileUpload
          center
          id="file"
          type="file"
          onInput={inputHandler}
          errorText="Please provide a file"
        />{" "}
        {}{" "}
        <Button type="submit" disabled={!formState.isValid}>
          ADD COURSE MATERIAL{" "}
        </Button>{" "}
      </form>{" "}
      <form className="course-form" onSubmit={courseAssignmentUploadHandler}>
        {" "}
        {isLoading && <LoadingSpinner asOverlay />}{" "}
        <FileUpload
          center
          id="file2"
          onInput={inputHandler2}
          errorText="Please provide a course assignment"
        />{" "}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler2}
        />{" "}
        <Input
          id="description"
          element="input"
          type="text"
          label="description"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid description."
          onInput={inputHandler2}
        />{" "}
        <Input
          id="dueDate"
          element="input"
          type="datetime-local"
          label="Due Time"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid date."
          onInput={inputHandler2}
        />{" "}
        {}{" "}
        <Button type="submit" disabled={!formState2.isValid}>
          ADD COURSE ASSIGNMENT{" "}
        </Button>{" "}
      </form>{" "}
    </React.Fragment>
  );
};

export default CourseMaterialUpload;
