import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";

import Select from "react-select";
// import "./DropDownSelect.css";

const DropDownSelect = (props) => {
  const [option, setOption] = useState();
  const [isValid, setIsValid] = useState(false);

  const optionPickerRef = useRef();

  const pickedHandler = (event) => {
    let pickedOption;
    let optionIsValid = isValid;
    if (event) {
      console.log(event.map((x) => x.value));
      // pickedOption = event.value;
      pickedOption = event.map((x) => x.value);
      setOption(pickedOption);
      setIsValid(true);
      optionIsValid = true;
    } else {
      setIsValid(false);
      optionIsValid = false;
    }
    props.onInput(props.id, pickedOption, optionIsValid);
  };

  const pickedOptionHandler = () => {
    optionPickerRef.current.click();
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <Select
              className="basic-multi-select"
              classNamePrefix="select"
              isMulti
              id={props.id}
              ref={optionPickerRef}
              options={props.options}
              onChange={pickedHandler}
              openMenuOnClick={pickedOptionHandler}
            />{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {!isValid && <p> {props.errorText} </p>}{" "}
    </div>
  );
};

export default DropDownSelect;
