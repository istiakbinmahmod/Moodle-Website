import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// import CourseList from "../../courses/components/CourseList";
import UsersList from "../../user/components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const CourseUsers = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  const courseID = useParams().courseID;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/courses/${courseID}/users`
        );

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );

  // return <CourseList items={COURSES} />;
};

export default CourseUsers;
