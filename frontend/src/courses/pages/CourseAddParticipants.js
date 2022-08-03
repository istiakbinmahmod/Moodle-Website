import React, { useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Select from "react-select";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./CourseForm.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import DropDownSelect from "../../shared/components/FormElements/DropDownSelect";

const selectItems = [
  { value: "1705086", label: "1705086" },
  { value: "1205001", label: "1205001" },
];

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
      console.log(formState.inputs.moodleID.value);
      await sendRequest(
        `http://localhost:5000/api/admin/edit/${courseID}`,
        "PATCH",
        JSON.stringify({
          // participants: formState.inputs.moodleID.value,
          participants: formState.inputs.moodleID.value,
          // participants: formState.inputs.moodleID.map((item) => item.value),
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

        <DropDownSelect
          id="moodleID"
          label="Student Moodle ID"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid moodle id."
          onInput={inputHandler}
          options={selectItems}
        />

        <Button type="submit" disabled={!formState.isValid}>
          ADD USER
        </Button>
      </form>
    </React.Fragment>
  );
};

export default CourseAddParticipants;