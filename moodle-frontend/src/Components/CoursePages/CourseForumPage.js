import { Grid, Typography, Card, CardContent } from "@mui/material";
import { React, useState, useEffect, useContext } from "react";
import Sidebar from "../Dashboard/Sidebar";
import Filter from "../Dashboard/Filter/Filter";
import useStyles from "../CourseDetail/GradeStyle";
import Paper from "@mui/material/Paper";
import ListSubheader from "@mui/material/ListSubheader";
// import List from "@mui/material/List";
// import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Divider } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// import Assignment icon
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
//  folder icon
import FolderIcon from "@mui/icons-material/Folder";
import { Assessment, Edit, ThumbUp } from "@mui/icons-material";
import CardActions from "@mui/material/CardActions";

import { List, ListItem, ListItemButton, CardActionArea } from "@mui/material";
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
import AllForumPosts from "../Forum/AllForumPosts";
import CourseForumPage from "../Forum/CourseForumPage";

const CoursePageForum = () => {
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
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/profile"
          : "/teacher/profile",
        {}
      );
    } else if (option === "edit-profile") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/edit-profile"
          : "/teacher/edit-profile"
      );
    } else if (option === "private-files") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/private-files"
          : "/teacher/private-files"
      );
    } else if (option === "logout") {
      auth.logout();
      navigate("/");
    } else if (option === "upload-private-files") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/upload-private-files"
          : "/teacher/upload-private-files"
      );
    } else if (option === "notification") {
      navigate(
        localStorage.getItem("userRole") === "student"
          ? "/student/notifications"
          : "/teacher/notifications"
      );
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
                      localStorage.getItem("userRole") === "student"
                        ? navigate(
                            "/student/my/course/" +
                              courseTitle +
                              "/" +
                              courseID +
                              "/forum",
                            {
                              state: {
                                courseID: courseID,
                                courseTitle: courseTitle,
                              },
                            }
                          )
                        : navigate(
                            "/teacher/my/course/" +
                              courseTitle +
                              "/" +
                              courseID +
                              "/forum",
                            {
                              state: {
                                courseID: courseID,
                                courseTitle: courseTitle,
                              },
                            }
                          );
                      // setComponent(<CourseForumPage courseID={courseID} />);
                    }}
                  >
                    <ListItemText primary="Forum" />
                    <ListItemIcon>
                      <Message />
                      {/* <FolderIcon /> */}
                    </ListItemIcon>
                  </ListItemButton>

                  {localStorage.getItem("userRole") === "teacher" && (
                    <>
                      <ListItemButton
                        key={4}
                        button
                        onClick={() => {
                          navigate(
                            "/teacher/my/course/" +
                              courseTitle +
                              "/" +
                              courseID +
                              "/forum/create-post",
                            {
                              state: {
                                courseID: courseID,
                                courseTitle: courseTitle,
                              },
                            }
                          );
                        }}
                      >
                        <ListItemText primary="Create a Forum Post" />
                        <ListItemIcon>
                          <Edit />
                        </ListItemIcon>
                      </ListItemButton>
                    </>
                  )}

                  {localStorage.getItem("userRole") === "student" && (
                    <>
                      <ListItemButton
                        key={2}
                        button
                        onClick={() => {
                          // print key value of the listItem
                          // alert(courseID);

                          navigate(
                            "/student/my/course/due-assignments/" +
                              courseTitle +
                              "/" +
                              courseID,
                            {
                              state: {
                                courseID: courseID,
                                courseTitle: courseTitle,
                              },
                            }
                          );

                          // setComponent(
                          //   <DueAssignment
                          //     // <AllAssignments
                          //     courseTitle={courseTitle}
                          //     courseID={courseID}
                          //     studentId={stdId}
                          //   />
                          // );
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
                          navigate(
                            "/student/my/course/completed-assignments/" +
                              courseTitle +
                              "/" +
                              courseID,
                            {
                              state: {
                                courseID: courseID,
                                courseTitle: courseTitle,
                              },
                            }
                          );
                          // setComponent(
                          //   <CompletedAssignment
                          //     courseID={courseID}
                          //     studentId={stdId}
                          //   />
                          // );
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

                          navigate(
                            "/teacher/my/course/" +
                              courseTitle +
                              "/" +
                              courseID +
                              "/assignments",
                            {
                              state: {
                                courseID: courseID,
                                courseTitle: courseTitle,
                              },
                            }
                          );

                          // setComponent(
                          //   <TeacherAllAssignments
                          //     // <AllAssignments
                          //     courseTitle={courseTitle}
                          //     courseID={courseID}
                          //     studentId={stdId}
                          //   />
                          // );
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

                      localStorage.getItem("userRole") === "student"
                        ? navigate(
                            "/student/my/course/" +
                              courseTitle +
                              "/" +
                              courseID +
                              "/participants",
                            {
                              state: {
                                courseID: courseID,
                                courseTitle: courseTitle,
                              },
                            }
                          )
                        : navigate(
                            "/teacher/my/course/" +
                              courseTitle +
                              "/" +
                              courseID +
                              "/participants",
                            {
                              state: {
                                courseID: courseID,
                                courseTitle: courseTitle,
                              },
                            }
                          );

                      // setComponent(
                      //   <Participants courseID={courseID} studentId={stdId} />
                      // );
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
                      localStorage.getItem("userRole") === "student"
                        ? navigate(
                            "/student/my/course/" +
                              courseTitle +
                              "/" +
                              courseID +
                              "/materials",
                            {
                              state: {
                                courseID: courseID,
                                courseTitle: courseTitle,
                              },
                            }
                          )
                        : navigate(
                            "/teacher/my/course/" +
                              courseTitle +
                              "/" +
                              courseID +
                              "/materials",
                            {
                              state: {
                                courseID: courseID,
                                courseTitle: courseTitle,
                              },
                            }
                          );
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

                          navigate(
                            "/teacher/my/course/" +
                              courseTitle +
                              "/" +
                              courseID +
                              "/assignments/upload",
                            {
                              state: {
                                courseID: courseID,
                                courseTitle: courseTitle,
                              },
                            }
                          );

                          // setComponent(<CreateAss courseID={courseID} />);
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

                          navigate(
                            "/teacher/my/course/" +
                              courseTitle +
                              "/" +
                              courseID +
                              "/materials/upload",
                            {
                              state: {
                                courseID: courseID,
                                courseTitle: courseTitle,
                              },
                            }
                          );

                          // setComponent(<CreateCourseMat courseID={courseID} />);
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
                {/* {component} */}
                <CourseForumPage
                  courseID={courseID}
                  courseTitle={courseTitle}
                />
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

export default CoursePageForum;
