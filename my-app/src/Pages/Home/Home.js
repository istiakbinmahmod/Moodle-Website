import React from "react";
import "./Home.css";
import Rest__img from "../../img/restaurant.jpg";
import RestCard from "../../Components/RestCard/RestCard";

function Home() {
  return (
    <>
      <div className="hero__area">
        <div className="inner__hero">
          <h3>
            Welcome To <span>BUET CSE MOODLE</span>
          </h3>
          <p>
            The Department of Computer Science and Engineering (CSE) of
            Bangladesh University of Engineering and Technology (BUET) is the
            first department of its kind in Bangladesh. BUET offers Bachelors,
            Masters, and Ph.D. Degree in Computer Science and Engineering. The
            education of CSE BUET is world-class in both the curricula and
            research activity.
          </p>
          <div className="form__group">
            <input type="text" placeholder="Burger.." />
            <button>Search</button>
          </div>
        </div>
      </div>

      {/* <div className="rest__area">
        <h3>Some famous Restaurants</h3>
        <div className="rest__cards">
          <RestCard title="Jimmy Restaurant" Rest__img={Rest__img} />
          <RestCard title="Jimmy Restaurant" Rest__img={Rest__img} />
          <RestCard title="Jimmy Restaurant" Rest__img={Rest__img} />
          <RestCard title="Jimmy Restaurant" Rest__img={Rest__img} />
          <RestCard title="Jimmy Restaurant" Rest__img={Rest__img} />
          <RestCard title="Jimmy Restaurant" Rest__img={Rest__img} />
        </div>
      </div> */}
    </>
  );
}

export default Home;
