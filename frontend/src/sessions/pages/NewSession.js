import React, { useState, useContext } from "react";

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

const NewSession = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      sessionID: {
        value: "",
        isValid: false,
      },
      startDate: {
        value: "",
        isValid: false,
      },
      endDate: {
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

  const sessionSubmitHandler = async (event) => {
    event.preventDefault();
    // console.log(formState.inputs); // send this to the backend!
    try {
      // setIsLoading(true);
      // const response = await fetch(
      //   "http://localhost:5000/api/admin/create-session",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       sessionID: formState.inputs.sessionID.value,
      //       startDate: formState.inputs.startDate.value,
      //       endDate: formState.inputs.endDate.value,
      //       // courses: formState.inputs.courses.value,
      //     }),
      //   }
      // );

      // const responseData = await response.json();
      // if (!response.ok) {
      //   throw new Error(responseData.message);
      // }
      // console.log(responseData);
      // setIsLoading(false);

      await sendRequest(
        "http://localhost:5000/api/admin/create-session",
        "POST",
        JSON.stringify({
          sessionID: formState.inputs.sessionID.value,
          startDate: formState.inputs.startDate.value,
          endDate: formState.inputs.endDate.value,
          // courses: formState.inputs.courses.value,
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
      <form className="session-form" onSubmit={sessionSubmitHandler}>
        <Input
          id="sessionID"
          element="input"
          type="text"
          label="Session ID"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid session id."
          onInput={inputHandler}
        />

        <Input
          id="startDate"
          element="input"
          type="text"
          label="Start Date"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid start date."
          onInput={inputHandler}
        />

        <Input
          id="endDate"
          element="input"
          type="text"
          label="End Date"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid end date."
          onInput={inputHandler}
        />

        {/* <Input
          id="courses"
          element="input"
          type="text"
          label="Courses "
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid end date."
          onInput={inputHandler}
        /> */}
        <Button type="submit" disabled={!formState.isValid}>
          ADD SESSION
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewSession;
