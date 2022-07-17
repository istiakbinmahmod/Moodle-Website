import React from "react";

import SessionList from "../components/SessionList";
// import UsersList from '../components/UsersList';

const Sessions = () => {
  const SESSIONS = [
    {
      session_id: "Jan 2020",
      start_date: "2020-01-01",
      end_date: "2020-01-01",
    },
  ];

  return <SessionList items={SESSIONS} />;
};

export default Sessions;
