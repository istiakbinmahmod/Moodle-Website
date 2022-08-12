import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import DropDownSelect from "../../shared/components/FormElements/DropDownSelect";
import { useHistory } from "react-router-dom";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./DeleteCourse.css";

let selectCourses, seletSession;

const DeleteCourse = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourses, setLoadedCourses] = useState();
  const history = useHistory();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/courses"
        );
        selectCourses = responseData.courses.map((crs) => ({
          value: crs._id,
          label: crs.courseID + " : " + crs.sessionName,
        }));
        console.log(selectCourses);
        setLoadedCourses(responseData.courses);
      } catch (err) {}
    };
    fetchCourses();
  }, [sendRequest]);

  const [formState, inputHandler] = useForm(
    {
      course_id: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const courseSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/admin/delete/course/${formState.inputs.course_id.value}`,
        "DELETE"
      );
      history.push("/");
    } catch (error) {}
  };

  return (
    <form className="course-form" onSubmit={courseSubmitHandler}>
      {!isLoading && loadedCourses && (
        <DropDownSelect
          id="course_id"
          label="Course ID"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid course id."
          onInput={inputHandler}
          options={selectCourses}
        />
      )}

      <Button type="submit" disabled={!formState.isValid}>
        DELETE COURSE
      </Button>
    </form>
  );
};

export default DeleteCourse;
