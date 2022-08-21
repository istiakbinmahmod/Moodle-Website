import React from "react";
import "./RestCard.css";
import { FaArrowRight } from "react-icons/fa";

function RestCard({ title, Rest__img }) {
  return (
    <div className="rest__card">
      <img src={Rest__img} alt="" />
      <h5>{title}</h5>
      <button>
        View <FaArrowRight />
      </button>
    </div>
  );
}

export default RestCard;
