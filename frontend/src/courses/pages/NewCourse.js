import React from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./CourseForm.css";

const NewCourse = () => {
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

  const courseSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend!
  };

  return (
    <form className="course-form" onSubmit={courseSubmitHandler}>
      <Input
        id="course_id"
        element="input"
        type="text"
        label="Course ID"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid course id."
        onInput={inputHandler}
      />

      <Input
        id="course_title"
        element="input"
        type="text"
        label="Course Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />

      <Input
        id="credit_hour"
        element="input"
        type="text"
        label="Credit Hour"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid course hour."
        onInput={inputHandler}
      />
      {/* <Input
        id="description"
        element="textarea"
        label="Description"
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
        ADD COURSE
      </Button>
    </form>
  );
};

export default NewCourse;
