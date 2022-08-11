// import React from "react";
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
import "./UserForm.css";

const NewUser = () => {
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
      await sendRequest(
        "http://localhost:5000/api/admin/create/user",
        "POST",
        JSON.stringify({
          moodleID: formState.inputs.moodle_id.value,
          name: formState.inputs.user_name.value,
          email: formState.inputs.email_id.value,
          // password: formState.inputs.phone_num.value,
          // date_of_birth: formState.inputs.date_of_birth.value,
          // address: formState.inputs.address.value,
          password: formState.inputs.password.value,
          role: formState.inputs.role.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/");
    } catch (error) {}
    // console.log(formState.inputs); // send this to the backend!
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />{" "}
      <form className="user-form" onSubmit={userSubmitHandler}>
        {" "}
        {isLoading && <LoadingSpinner asOverlay />}{" "}
        <Input
          id="moodle_id"
          element="input"
          type="text"
          label="Moodle ID"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid id."
          onInput={inputHandler}
        />{" "}
        <Input
          id="user_name"
          element="input"
          type="text"
          label="User Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
        />{" "}
        <Input
          id="email_id"
          element="input"
          type="email"
          label="Email ID"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid email."
          onInput={inputHandler}
        />{" "}
        {/* <Input
                      id="phone_num"
                      element="input"
                      type="text"
                      label="Phone Number"
                      validators={[VALIDATOR_REQUIRE()]}
                      errorText="Please enter a valid phone number."
                      onInput={inputHandler}
                    /> */}{" "}
        {/* <Input
                      id="date_of_birth"
                      element="input"
                      type="text"
                      label="Date of Birth"
                      validators={[VALIDATOR_REQUIRE()]}
                      errorText="Please enter a valid date of birth."
                      onInput={inputHandler}
                    /> */}{" "}
        {/* <Input
                      id="address"
                      element="input"
                      type="text"
                      label="Address"
                      validators={[VALIDATOR_REQUIRE()]}
                      errorText="Please enter a valid address."
                      onInput={inputHandler}
                    /> */}{" "}
        <Input
          id="password"
          element="input"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid password."
          onInput={inputHandler}
        />
        {/* <Input
                    name="role"
                    id="role"
                    element="input"
                    // type="text"
                    type="radio"
                    value="student"
                    label="Role"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid role."
                    initialValue="student/teacher"
                    onInput={inputHandler}
                  />
                  student
                  <Input
                    name="role"
                    id="role"
                    element="input"
                    // type="text"
                    type="radio"
                    value="teacher"
                    label="Role"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid role."
                    initialValue="student/teacher"
                    onInput={inputHandler}
                  />
                  teacher */}{" "}
        <Input
          id="role"
          element="input"
          type="text"
          label="Role"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid role."
          onInput={inputHandler}
        ></Input>{" "}
        <Button type="submit" disabled={!formState.isValid}>
          ADD USER{" "}
        </Button>{" "}
      </form>{" "}
    </React.Fragment>
  );
};

export default NewUser;
