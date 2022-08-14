import React, { useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./CourseForm.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";

const NewCourse = () => {

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  
  const sessionID = useParams().sessionID;
  const auth = useContext(AuthContext);
  console.log(
    "NewCourse.js: sessionID: " + sessionID + " auth: " + auth
);

  const [formState, inputHandler] = useForm(
    {
      courseID: {
        value: "",
        isValid: false,
      },
      sessionID: {
        value: "",
        isValid: false,
      },
      courseTitle: {
        value: "",
        isValid: false,
      },
      courseDescription: {
        value: "",
        isValid: false,
      },
      courseCreditHour: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const courseSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(auth.token);
    try {
      await sendRequest(
        `http://localhost:5000/api/admin/create-course/${sessionID}`,
        "POST",
        JSON.stringify({
          courseID: formState.inputs.courseID.value,
          sessionID: sessionID,
          // sessionID: formState.inputs.sessionID.value,
          courseTitle: formState.inputs.courseTitle.value,
          courseDescription: formState.inputs.courseDescription.value,
          courseCreditHour: formState.inputs.courseCreditHour.value,
        }),
        {
          "Content-Type": "application/json",
          // Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      <form className="course-form" onSubmit={courseSubmitHandler}>
        <Input
          id="courseID"
          element="input"
          type="text"
          label="Course ID"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid course id."
          onInput={inputHandler}
        />{" "}
        <Input
          id="sessionID"
          element="input"
          type="text"
          label="Session ID"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid session id."
          onInput={inputHandler}
        />{" "}
        <Input
          id="courseTitle"
          element="input"
          type="text"
          label="Course Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />{" "}
        <Input
          id="courseDescription"
          element="input"
          type="text"
          label="Course Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid Description."
          onInput={inputHandler}
        />{" "}
        <Input
          id="courseCreditHour"
          element="input"
          type="text"
          label="Course Credit Hour"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid course hour."
          onInput={inputHandler}
        />{" "}
        <Button type="submit" disabled={!formState.isValid}>
          ADD COURSE{" "}
        </Button>{" "}
      </form>{" "}
    </React.Fragment>
  );
};

export default NewCourse;
