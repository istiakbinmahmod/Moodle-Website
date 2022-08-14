import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import DropDownSelect from "../../shared/components/FormElements/DropDownSelect";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./CourseForm.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";

let courseParticipants;

const CourseRemoveParticipants = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const courseID = useParams().courseID;
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchCourseParticipants = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/courses/${courseID}/users`
        );
        courseParticipants = responseData.users.map((usr) => ({
          value: usr.moodleID,
          label: usr.moodleID,
        }));
        console.log(courseParticipants);
        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchCourseParticipants();
  }, [sendRequest]);

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
        `http://localhost:5000/api/admin/removeUser/course/${courseID}`,
        "PATCH",
        JSON.stringify({
          participants: formState.inputs.moodleID.value,
          //   courseID: courseID,
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
      <ErrorModal error={error} onClear={clearError} />{" "}
      <form className="course-form" onSubmit={enrolSubmitHandler}>
        {" "}
        {isLoading && <LoadingSpinner asOverlay />}{" "}
        {!isLoading && loadedUsers && (
          <DropDownSelect
            id="moodleID"
            label="Moodle ID"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid moodle id."
            onInput={inputHandler}
            options={courseParticipants}
          />
        )}{" "}
        <Button type="submit" disabled={!formState.isValid}>
          REMOVE USER{" "}
        </Button>{" "}
      </form>{" "}
    </React.Fragment>
  );
};

export default CourseRemoveParticipants;
