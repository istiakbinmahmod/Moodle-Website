import React from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./UserForm.css";

const NewUser = () => {
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
      phone_num: {
        value: "",
        isValid: false,
      },
      date_of_birth: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      role: {
        value: "",
        isValid: false,
      },
      // title: {
      //   value: "",
      //   isValid: false,
      // },
      // description: {
      //   value: "",
      //   isValid: false,
      // },
      // address: {
      //   value: "",
      //   isValid: false,
      // },
    },
    false
  );

  const userSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend!
  };

  return (
    <form className="user-form" onSubmit={userSubmitHandler}>
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
        id="phone_num"
        element="input"
        type="text"
        label="Phone Number"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid phone number."
        onInput={inputHandler}
      />
      <Input
        id="date_of_birth"
        element="input"
        type="text"
        label="Date of Birth"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid date of birth."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        type="text"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />
      <Input
        id="password"
        element="input"
        type="password"
        label="Password"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid password."
        onInput={inputHandler}
      />
      <Input
        id="role"
        element="input"
        type="text"
        label="Role"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />

      {/* <Input
        id="description"
        element="textarea"
        label="Description"
        // validators={[VALIDATOR_REQUIRE()]}
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      /> */}
      <Button type="submit" disabled={!formState.isValid}>
        ADD USER
      </Button>
    </form>
  );
};

export default NewUser;
