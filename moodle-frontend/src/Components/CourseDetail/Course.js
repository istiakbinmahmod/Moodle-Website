import { Grid, Typography, Card, CardContent } from "@mui/material";
import { React, useState, useEffect, useContext } from "react";
import Sidebar from "../Dashboard/Sidebar";
import Filter from "../Dashboard/Filter/Filter";
import useStyles from "./GradeStyle";
import Paper from "@mui/material/Paper";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Divider } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
// import Assignment icon
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
//  folder icon
import FolderIcon from "@mui/icons-material/Folder";
// grade icon
import GradeIcon from "@mui/icons-material/Grade";
import DueAssignment from "../Assignments/Due";
import CompletedAssignment from "../Assignments/Completed";
import Grade from "../Scores/Grade";
import CourseFiles from "../Assignments/CourseMat";
// import CourseFiles from "../CourseMaterials/Materials";
// import CourseFiles from "../CourseMaterials/CourseMat";
// import CourseFiles from "../CourseMaterials/CourseMaterials";
import { AuthContext } from "../../Components/Context/AuthContext";
import { useHttpClient } from "../../Components/Context/http-hook";
import Participants from "../Participants/Participants";
import CreateAss from "../Assignments/AssignmentUpload";
import CreateCourseMat from "../CourseMaterials/CourseMaterialUpload";
import AllAssignments from "../Assignments/AllAssignments";
import TeacherAllAssignments from "../Assignments/TeacherAllAssignments";

const CourseDetail = () => {
  const classes = useStyles();
  // useState to store the option selected
  const [component, setComponent] = useState(<DueAssignment />);
  // get the courseId from the url
  // using useParams from react-router-dom
  const { courseTitle, courseID } = useParams();
  console.log(courseID);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourseMaterials, setLoadedCourseMaterials] = useState();

  const navigate = useNavigate();
  const getToken = localStorage.getItem("token");

  let url =
    localStorage.getItem("userRole") === "student"
      ? "http://localhost:5000/api/students/get-course-materials/" + courseID
      : "http://localhost:5000/api/teachers/get-materials/" + courseID;

  useEffect(() => {
    const fetchCourseMaterials = async () => {
      try {
        //   console.log(url);
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedCourseMaterials(responseData.courseMaterials);
      } catch (err) {}
    };
    fetchCourseMaterials();
  }, [sendRequest, url, getToken]);

  const stdId = 2;

  return (
    <div className={classes.root}>
      <Sidebar />
      {/* make grid of two column  */}
      {/* first column got 1/4th of area */}
      {/* second column got 3/4th of area */}
      <main className={classes.content}>
        {/* <Typography>Course Detail</Typography> */}
        <Grid container>
          {/* first column */}
          <Grid item xs={12} sm={6} md={3}>
            {/* set paper heifht to inifinity */}

            <Paper className={classes.paper} style={{ height: "760px" }}>
              {/* set an course image of round sized */}
              <div className={classes.Img}>
                <img
                  className={classes.courseImg}
                  src="https://www.kindpng.com/picc/m/79-793803_books-icon-study-icon-transparent-background-hd-png.png"
                />
              </div>
              <Typography
                style={{
                  fontSize: "20px",
                  paddingLeft: "15px",
                  paddingTop: "20px",
                }}
              >
                {" "}
                {courseTitle}{" "}
              </Typography>

              <Divider />
              <Divider />

              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Course Actions
                  </ListSubheader>
                }
              >
                {/* choose a listItem and execute an action */}
                {/* {!isLoading && loadedCourseAssignments && ( */}
                {/* // loadedCourseAssignments.map((ass) => ( */}

                <ListItemButton
                  key={4}
                  // onClick={() => {
                  //   // print key value of the listItem

                  //   setComponent(<CreateCourseMat courseID={courseID} />);
                  // }}
                >
                  <ListItemText primary="Forum" />
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                </ListItemButton>

                {localStorage.getItem("userRole") === "student" && (
                  <>
                    <ListItemButton
                      key={1}
                      button
                      onClick={() => {
                        // print key value of the listItem
                        // alert(courseID);

                        setComponent(
                          <DueAssignment
                            // <AllAssignments
                            courseTitle={courseTitle}
                            courseID={courseID}
                            studentId={stdId}
                          />
                        );
                      }}
                    >
                      <ListItemText primary="Due Assignments" />
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                    </ListItemButton>

                    <ListItemButton
                      key={2}
                      onClick={() => {
                        // print key value of the listItem
                        console.log("key: ", 2);
                        console.log("Completed clicked");

                        setComponent(
                          <CompletedAssignment
                            courseID={courseID}
                            studentId={stdId}
                          />
                        );
                      }}
                    >
                      <ListItemText primary="Completed Assignments" />
                      <ListItemIcon>
                        <AssignmentTurnedInIcon />
                      </ListItemIcon>
                    </ListItemButton>
                  </>
                )}

                {localStorage.getItem("userRole") === "teacher" && (
                  <>
                    <ListItemButton
                      key={1}
                      button
                      onClick={() => {
                        // print key value of the listItem
                        // alert(courseID);

                        setComponent(
                          <TeacherAllAssignments
                            // <AllAssignments
                            courseTitle={courseTitle}
                            courseID={courseID}
                            studentId={stdId}
                          />
                        );
                      }}
                    >
                      <ListItemText primary="All Assignments" />
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                    </ListItemButton>
                  </>
                )}

                <ListItemButton
                  key={3}
                  onClick={() => {
                    // print key value of the listItem

                    setComponent(
                      <Participants courseID={courseID} studentId={stdId} />
                    );
                  }}
                >
                  <ListItemText primary="Participants" />
                  <ListItemIcon>
                    <GradeIcon />
                  </ListItemIcon>
                </ListItemButton>

                <ListItemButton
                  key={4}
                  onClick={() => {
                    // print key value of the listItem

                    setComponent(<CourseFiles courseID={courseID} />);
                  }}
                >
                  <ListItemText primary="Materials" />
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                </ListItemButton>

                {localStorage.getItem("userRole") === "teacher" && (
                  <>
                    <ListItemButton
                      key={5}
                      onClick={() => {
                        // print key value of the listItem

                        setComponent(<CreateAss courseID={courseID} />);
                      }}
                    >
                      <ListItemText primary="Upload Assignment" />
                      <ListItemIcon>
                        <FolderIcon />
                      </ListItemIcon>
                    </ListItemButton>
                    <ListItemButton
                      key={6}
                      onClick={() => {
                        // print key value of the listItem

                        setComponent(<CreateCourseMat courseID={courseID} />);
                      }}
                    >
                      <ListItemText primary="Upload Material" />
                      <ListItemIcon>
                        <FolderIcon />
                      </ListItemIcon>
                    </ListItemButton>
                  </>
                )}
              </List>
            </Paper>
          </Grid>

          {/* second column */}
          {/* which got 3/4th of area */}
          <Grid item xs={12} sm={6} md={9}>
            <Paper className={classes.paper} style={{ paddingTop: "45px" }}>
              <Typography>Course Actions</Typography>
              <Divider />
              {component}
              {/* <CourseFiles /> */}
              {/* <Grade studentId={2} /> */}
              {/* <DueAssignment courseId={courseId}/> */}
            </Paper>
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

export default CourseDetail;