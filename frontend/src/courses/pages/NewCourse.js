import React, { useState, useContext } from "react";

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

const NewCourse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

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
      participants: [
        {
          value: "",
          isValid: false,
        },
      ],
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

  // const courseSubmitHandler = (event) => {
  //   event.preventDefault();
  //   console.log(formState.inputs); // send this to the backend!
  // };

  const courseSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/admin/create-course",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseID: formState.inputs.courseID.value,
            sessionID: formState.inputs.sessionID.value,
            courseTitle: formState.inputs.courseTitle.value,
            courseDescription: formState.inputs.courseDescription.value,
            courseCreditHour: formState.inputs.courseCreditHour.value,
            participants: formState.inputs.participants.value,
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      console.log(responseData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message || "Something went wrong");
    }
    // console.log(formState.inputs); // send this to the backend!
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <form className="course-form" onSubmit={courseSubmitHandler}>
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
          id="sessionID"
          element="input"
          type="text"
          label="Session ID"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid session id."
          onInput={inputHandler}
        />
        <Input
          id="courseTitle"
          element="input"
          type="text"
          label="Course Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="courseDescription"
          element="input"
          type="text"
          label="Course Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid Description."
          onInput={inputHandler}
        />
        <Input
          id="courseCreditHour"
          element="input"
          type="text"
          label="Course Credit Hour"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid course hour."
          onInput={inputHandler}
        />
        <Input
          id="participants"
          element="input"
          type="text"
          label="Course Participants"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid course id."
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
    </React.Fragment>
  );
};

export default NewCourse;
