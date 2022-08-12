import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { useHttpClient } from "../../shared/hooks/http-hook";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./UserForm.css";

const NewStudent = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      moodle_id: {
        value: "",
        isValid: false,
      },
      user_name: {
        value: "",
        isValid: false,
      },
      email_id: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const userSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // const formData = new FormData();
      // formData.append("moodleID", formState.inputs.moodle_id.value);
      // formData.append("name", formState.inputs.user_name.value);
      // formData.append("email", formState.inputs.email_id.value);
      // formData.append("password", formState.inputs.password.value);
      // console.log(formData.values);
      await sendRequest(
        "http://localhost:5000/api/admin/create/student",
        "POST",
        // formData,
        JSON.stringify({
          moodleID: formState.inputs.moodle_id.value,
          name: formState.inputs.user_name.value,
          email: formState.inputs.email_id.value,
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="user-form" onSubmit={userSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="moodle_id"
          element="input"
          type="text"
          label="Moodle ID"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid id."
          onInput={inputHandler}
        />
        <Input
          id="user_name"
          element="input"
          type="text"
          label="User Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
        />
        <Input
          id="email_id"
          element="input"
          type="email"
          label="Email ID"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid email."
          onInput={inputHandler}
        />
        <Input
          id="password"
          element="input"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid password."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD STUDENT
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewStudent;
