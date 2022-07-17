import React from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./SessionForm.css";

const NewSession = () => {
  const [formState, inputHandler] = useForm(
    {
      course_id: {
        value: "",
        isValid: false,
      },
      course_title: {
        value: "",
        isValid: false,
      },
      credit_hour: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const sessionSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend!
  };

  return (
    <form className="session-form" onSubmit={sessionSubmitHandler}>
      <Input
        id="session_id"
        element="input"
        type="text"
        label="Session ID"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid session id."
        onInput={inputHandler}
      />

      <Input
        id="start_date"
        element="input"
        type="text"
        label="Start Date"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid start date."
        onInput={inputHandler}
      />

      <Input
        id="end_date"
        element="input"
        type="text"
        label="End Date"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid end date."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD SESSION
      </Button>
    </form>
  );
};

export default NewSession;
