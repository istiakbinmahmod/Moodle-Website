import React, { useEffect, useState, useContext } from "react";

import SessionList from "../components/SessionList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
const Sessions = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedSessions, setLoadedSessions] = useState();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const formData = new FormData();
        const responseData = await sendRequest(
          "http://localhost:5000/api/admin/get/sessions",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );

        setLoadedSessions(responseData.sessions);
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
      {!isLoading && loadedSessions && <SessionList items={loadedSessions} />}
    </React.Fragment>
  );
};

export default Sessions;
