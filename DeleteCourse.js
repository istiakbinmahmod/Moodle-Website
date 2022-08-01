import React, { useState, useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import CourseList from "../components/CourseList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./DeleteCourse.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
const DeleteCourse = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  //const [loadedCourses, setLoadedCourses] = useState();
      //   title: {
      //     value: "",
      //     isValid: false,
      //   },
      //   description: {
      //     value: "",
      //     isValid: false,
      //   },
      //   address: {
      //     value: "",
      //     isValid: false,
      //   },
      const courseID = useParams().courseID;

      useEffect(() => {
        const deletecrs=async() =>{ 
          try{
             await sendRequest(
              `http://localhost:5000/api/admin/delete/course/${courseID}`,"DELETE"
            );
            // setLoadedCourses(responseData.courses);
          }catch(err){}
        };
        deletecrs();

      }, [sendRequest]);
   

  // const coursedeleteHandler = async() => {
  //   setShowConfirmModal(false);
  //   sendRequest("http://localhost:5000/api/delete/course/${}") // send this to the backend!
  // };

  return (
    <React.Fragment>
    <ErrorModal error={error} onClear={clearError} />
    {isLoading && (
      <div className="center">
        <LoadingSpinner />
      </div>
    )}
    {/* {!isLoading && loadedCourses && <CourseList items={loadedCourses} />} */}
  </React.Fragment>

    // <form className="course-form" onSubmit={courseSubmitHandler}>
    //   <Input
    //     id="course_id"
    //     element="input"
    //     type="text"
    //     label="Course ID"
    //     validators={[VALIDATOR_REQUIRE()]}
    //     errorText="Please enter a valid course id."
    //     onInput={inputHandler}
    //   />
    //   {/* <Input
    //     id="description"
    //     element="textarea"
    //     label="Description"
    //     validators={[VALIDATOR_MINLENGTH(5)]}
    //     errorText="Please enter a valid description (at least 5 characters)."
    //     onInput={inputHandler}
    //   />
    //   <Input
    //     id="address"
    //     element="input"
    //     label="Address"
    //     validators={[VALIDATOR_REQUIRE()]}
    //     errorText="Please enter a valid address."
    //     onInput={inputHandler}
    //   /> */}
    //   <Button type="submit" disabled={!formState.isValid}>
    //     DELETE COURSE
    //   </Button>
    // </form>
  );
};

export default DeleteCourse;
