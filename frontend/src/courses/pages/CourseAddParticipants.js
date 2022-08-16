import React, { useState, useContext, useEffect } from "react";
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

// const selectItems = [
//   { value: "1705086", label: "1705086" },
//   { value: "1205001", label: "1205001" },
// ];
let selectUsers;
const CourseAddParticipants = () => {

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  // const [selectItems, setSelectItems] = useState();
  const history = useHistory();

 

 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/admin/get/users"
          , 
          "GET",
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
      
        selectUsers = responseData.users.map((usr) => ({
          value: usr.moodleID,
          label: usr.moodleID,
        }));
        console.log(responseData);
        setLoadedUsers(responseData.users);
       
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

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


  const enrolSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      console.log(formState.inputs.moodleID.value);
      await sendRequest(
        `http://localhost:5000/api/admin/edit/${courseID}`,
        "PATCH",
        JSON.stringify({
          participants: formState.inputs.moodleID.value,
        }),
        {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${localStorage.getItem("token")}`,
        }
      );
      history.push("/");
    } catch (error) {}
  };

  return (
    // <React.Fragment>
    //   <ErrorModal error={error} onClear={clearError} />{" "}
      <form className="course-form" onSubmit={enrolSubmitHandler}>
        {" "}
      
        {!isLoading && loadedUsers && (
        <DropDownSelect
          id="moodleID"
          label="Student Moodle ID"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid moodle id."
          onInput={inputHandler}
          options={selectUsers}
        />)}
        <Button type="submit" disabled={!formState.isValid}>
          ADD USER{" "}
        </Button>{" "}
      </form>
    // </React.Fragment>
  );
};

export default CourseAddParticipants;
