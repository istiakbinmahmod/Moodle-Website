import { Card, CardActionArea, Typography } from "@mui/material";
import useStyles from "./StudentDashboardStyle";
import logo from "./assets/book-icon.png";

const CourseCard = ({ course }) => {
  const classes = useStyles();

  const {
    courseID,
    sessionID,
    sessionName,
    courseTitle,
    courseDescription,
    courseCreditHour,
    participants,
    courseMaterials,
    courseAssignments,
    // forum,
    // ...rest
  } = course;

  const courseUrl = "/my/course/" + courseTitle + "/" + course._id;
  return (
    <CardActionArea href={courseUrl}>
      <Card
        className={classes.card}
        style={{ background: "#f7f8fa", margin: "10px" }}
      >
        <div className={classes.courseHeader} style={{ background: "#005671" }}>
          {/* change font in typography */}
          {/* give some padding in left */}

          <Typography
            variant="h5"
            style={{
              color: "white",
              fontWeight: "bold",
              paddingLeft: "15px",
              paddingTop: "10px",
            }}
          >
            {courseTitle}
          </Typography>
          {/* <Typography className={classes.courseHeaderText} variant="overline">{courseTitle}</Typography> */}
          {/* description */}
          <Typography
            variant="h6"
            style={{ color: "white", fontWeight: "bold", paddingLeft: "15px" }}
          >
            {courseDescription}
          </Typography>
          <Typography
            variant="h9"
            style={{ color: "white", paddingLeft: "15px" }}
          >
            {sessionName} : {courseID}
          </Typography>
        </div>
        <div className={classes.TeacherImg}>
          <img className={classes.courseTeacherImg} src={logo} />
        </div>
      </Card>
    </CardActionArea>
  );
};

export default CourseCard;
