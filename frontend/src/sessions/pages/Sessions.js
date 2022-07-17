import React, { useEffect, useState } from "react";

import SessionList from "../components/SessionList";
// import UsersList from '../components/UsersList';
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Sessions = () => {
  // const SESSIONS = [
  //   {
  //     sessionID: "Jan 2020",
  //     startDate: "2020-01-01",
  //     endDate: "2020-01-01",
  //     courses: [],
  //   },
  // ];
  // return <SessionList items={SESSIONS} />;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedSessions, setLoadedSessions] = useState();
  // const [loadedSessionsWithCourses, setLoadedSessionsWithCourses] = useState();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/admin/get/sessions"
        );

        setLoadedSessions(responseData.sessions);
        // setLoadedSessionsWithCourses(responseData.sessionsWithCourses);
      } catch (err) {}
    };
    fetchSessions();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedSessions && (
        <SessionList
          items={loadedSessions}
          // items_crs={loadedSessionsWithCourses}
        />
      )}
    </React.Fragment>
  );
};

export default Sessions;
