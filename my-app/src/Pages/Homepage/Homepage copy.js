import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Homepage.css";
import { AuthContext } from "../../Context/AuthContext";
import { useHttpClient } from "../../Hooks/http-hook";
import Rest__img from "../../img/restaurant.jpg";
import RestCard from "../../Components/RestCard/RestCard";
import { FaArrowRight } from "react-icons/fa";

function HomepageCopy() {
  const auth = useContext(AuthContext);
  console.log(auth.userId);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourses, setLoadedCourses] = useState();

  const navigate = useNavigate();
  //   const [user, setUser] = useState("");
  const getToken = auth.token;

  let url =
    "http://localhost:5000/api/users/" +
    localStorage.getItem("userId") +
    "/courses";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log(url);
        const responseData = await sendRequest(url);
        setLoadedCourses(responseData.courses);
        console.log(responseData);
      } catch (err) {}
    };
    fetchCourses();
  }, [sendRequest, url]);

  return (
    <>
      {/* <div className="hero__area">
        <div className="inner__hero">
          <h3>
            Welcome To <span>BUET CSE MOODLE course page!</span>
          </h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo iusto
            dignissimos quisquam, blanditiis pariatur laboriosam perspiciatis
            reprehenderit deserunt dolorem
          </p>
          <div className="form__group">
            <input type="text" placeholder="Burger.." />
            <button>Search</button>
          </div>
        </div>
      </div> */}
      {/* loadedCourses.map((crs) => {
          <h2>123</h2>;
          //   <RestCard title={crs.courseID} Rest__img={Rest__img} />;
        })} */}
      <div className="rest__area">
        <h3>My Courses</h3>
        <div className="rest__cards">
          {!isLoading &&
            loadedCourses &&
            loadedCourses.map((crs) => (
              <div className="rest__card">
                <img src={Rest__img} alt="" />
                <h5>{crs.courseID}</h5>
                <NavLink to={"/course/" + crs.id}>
                  <button>
                    View <FaArrowRight />
                  </button>
                </NavLink>
              </div>
              // <div>
              //   <RestCard title={crs.courseID} Rest__img={Rest__img} />
              //   <button>
              //     View <FaArrowRight />
              //   </button>
              // </div>
            ))}
          {/* <RestCard title="Jimmy Restaurant" Rest__img={Rest__img} />
          <RestCard title="Jimmy Restaurant" Rest__img={Rest__img} />
          <RestCard title="Jimmy Restaurant" Rest__img={Rest__img} />
          <RestCard title="Jimmy Restaurant" Rest__img={Rest__img} />
          <RestCard title="Jimmy Restaurant" Rest__img={Rest__img} />
          <RestCard title="Jimmy Restaurant" Rest__img={Rest__img} /> */}
        </div>
      </div>
    </>
  );
}

export default HomepageCopy;
