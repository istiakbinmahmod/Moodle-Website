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
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import { AuthContext } from "../../Components/Context/AuthContext";
import { useHttpClient } from "../../Components/Context/http-hook";
import Participants from "../Participants/Participants";
import CreateAss from "../Assignments/AssignmentUpload";
import CreateCourseMat from "../CourseMaterials/CourseMaterialUpload";
import AllAssignments from "../Assignments/AllAssignments";
import TeacherAllAssignments from "../Assignments/TeacherAllAssignments";
import logo from "../Dashboard/StudentDashboard/assets/book-icon.png";
import { AssignmentLate, Group, Message } from "@mui/icons-material";
import Forum from "../Forum/Forum";

const CourseDetail = () => {
  const classes = useStyles();
  const { state } = useLocation();
  const courseTitle = state.courseTitle;
  const courseID = state.courseID;
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const stdId = auth.userId;
  const [component, setComponent] = useState();
  const [option, setOption] = useState();

  useEffect(() => {
    if (option === "profile") {
      navigate("/student/profile", {});
    } else if (option === "edit-profile") {
      navigate("/student/edit-profile");
    } else if (option === "logout") {
      auth.logout();
      navigate("/");
    }
  }, [option]);

  return (
    <div className={classes.root}>
      <Sidebar setOption={setOption} />
      <main className={classes.content}>
        <div>
          <Grid container>
            {/* first column */}
            <Grid item xs={12} sm={6} md={3}>
              {/* set paper heifht to inifinity */}

              <Paper className={classes.paper} style={{ height: "760px" }}>
                {/* set an course image of round sized */}
                <div className={classes.Img}>
                  <img className={classes.courseImg} src={logo} />
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
                    key={1}
                    onClick={() => {
                      // print key value of the listItem

                      setComponent(<Forum courseID={courseID} />);
                    }}
                  >
                    <ListItemText primary="Forum" />
                    <ListItemIcon>
                      <Message />
                      {/* <FolderIcon /> */}
                    </ListItemIcon>
                  </ListItemButton>

                  {localStorage.getItem("userRole") === "student" && (
                    <>
                      <ListItemButton
                        key={2}
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
                          <AssignmentLate />
                        </ListItemIcon>
                      </ListItemButton>

                      <ListItemButton
                        key={3}
                        onClick={() => {
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
                        key={4}
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
                    key={5}
                    onClick={() => {
                      // print key value of the listItem

                      setComponent(
                        <Participants courseID={courseID} studentId={stdId} />
                      );
                    }}
                  >
                    <ListItemText primary="Participants" />
                    <ListItemIcon>
                      <Group />
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
              <Paper
                className={classes.paper}
                style={{
                  paddingTop: "2px",
                  height: "100%",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {/* <Typography>Course Actions</Typography> */}
                <Divider />
                {component}
                {/* <CourseFiles /> */}
                {/* <Grade studentId={2} /> */}
                {/* <DueAssignment courseId={courseId}/> */}
              </Paper>
            </Grid>
          </Grid>
        </div>
      </main>
    </div>
    // <div className={classes.root}>
    // <Sidebar />
    // {/* make grid of two column  */}
    // {/* first column got 1/4th of area */}
    // {/* second column got 3/4th of area */}
    // <main className={classes.content}>
    // {/* <Typography>Course Detail</Typography> */}

    // {/* </main> */}
    // {/* </div> */}
  );
};

export default CourseDetail;
