import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import "./UserItem.css";

const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <div className="user-item__info">
          <h2>
            {"Name : "}
            {props.name}
          </h2>
          <h2>
            {"Email : "}
            {props.email}
          </h2>
          <h2>
            {"Phone : "}
            {props.phone}
          </h2>
          <h2>
            {"Role : "}
            {props.role}
          </h2>
        </div>
      </Card>
    </li>
  );
};

export default UserItem;
