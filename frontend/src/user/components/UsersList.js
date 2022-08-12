import React from "react";

import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
import "./UsersList.css";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <UserItem
          key={user.moodleID}
          id={user.moodleID}
          // image={user.image}
          name={user.name}
          email={user.email}
          phone={user.phone}
          role={user.role}
          objID={user._id}
        />
      ))}
    </ul>
  );
};

export default UsersList;
