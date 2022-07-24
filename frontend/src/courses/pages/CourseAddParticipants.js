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

const CourseAddParticipants = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const courseID = useParams().courseID;

  const [formState, inputHandler] = useForm(
    {
      moodleID: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const enrolSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/admin/edit/${courseID}`,
        "PATCH",
        JSON.stringify({
          participants: formState.inputs.moodleID.value,
          //   courseID: courseID,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/");
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="course-form" onSubmit={enrolSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="moodleID"
          element="input"
          type="text"
          label="Student Moodle ID"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid moodle id."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD USER
        </Button>
      </form>
    </React.Fragment>
  );
};

export default CourseAddParticipants;
