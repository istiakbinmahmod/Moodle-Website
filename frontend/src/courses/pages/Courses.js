import React, { useEffect, useState } from "react";

import CourseList from "../components/CourseList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Courses = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourses, setLoadedCourses] = useState();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/courses"
        );

        setLoadedCourses(responseData.courses);
      } catch (err) {}
    };
    fetchCourses();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCourses && <CourseList items={loadedCourses} />}
    </React.Fragment>
  );

  // return <CourseList items={COURSES} />;
};

export default Courses;
