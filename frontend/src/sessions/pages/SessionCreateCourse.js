import React, { useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./SessionForm.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const SessionCreateCourse = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const sessionID = useParams().sessionID;

  const [formState, inputHandler] = useForm(
    {
      courseID: {
        value: "",
        isValid: false,
      },
      // sessionID: {
      //   value: "",
      //   isValid: false,
      // },
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
      // courses: [
      //   {
      //     value: "",
      //     isValid: true,
      //   },
      // ],
    },
    false
  );

  const history = useHistory();

  const courseSubmitHandler = async (event) => {
    event.preventDefault();
    // console.log(formState.inputs); // send this to the backend!
    try {
      await sendRequest(
        `http://localhost:5000/api/admin/create-course/${sessionID}`,
        "POST",
        JSON.stringify({
          courseID: formState.inputs.courseID.value,
          sessionID: sessionID,
          courseTitle: formState.inputs.courseTitle.value,
          courseDescription: formState.inputs.courseDescription.value,
          courseCreditHour: formState.inputs.courseCreditHour.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
    } catch (error) {
      // setIsLoading(false);
      // setError(error.message || "Something went wrong");
    }
  };

  // const errorHandler = () => {
  //   setError(null);
  // };

  // const sessionSubmitHandler = (event) => {
  //   event.preventDefault();
  //   console.log(formState.inputs); // send this to the backend!
  // };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={/*errorHandler*/ clearError} />
      {!isLoading && (
        <form className="session-form" onSubmit={courseSubmitHandler}>
          <Input
            id="courseID"
            element="input"
            type="text"
            label="Course ID"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid course id."
            onInput={inputHandler}
          />

          <Input
            id="courseTitle"
            element="input"
            type="text"
            label="Course Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid course title."
            onInput={inputHandler}
          />

          <Input
            id="courseDescription"
            element="input"
            type="text"
            label="Course Description"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid course desc."
            onInput={inputHandler}
          />

          <Input
            id="courseCreditHour"
            element="input"
            type="text"
            label="Course Credit Hour"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid course credit hour."
            onInput={inputHandler}
          />

          <Button type="submit" disabled={!formState.isValid}>
            ADD COURSE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default SessionCreateCourse;
