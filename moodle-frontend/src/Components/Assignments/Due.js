import { React, useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardActionArea, Grid } from "@mui/material";
import { AuthContext } from "../../Components/Context/AuthContext";
import { useHttpClient } from "../../Components/Context/http-hook";
import { format } from "date-fns";
import { TextField } from "@mui/material";
import { Assessment } from "@mui/icons-material";
import AssignmentCard from "./AssignmentCard";
import CompletedAssignmentCard from "./CompletedAssignmentCard";
import SubmissionPanel from "../Submission/Submission";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const DueAssignment = (props) => {
  // destructuring the props
  const { courseTitle, courseID, studentId } = props;
  // alert(courseTitle);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourseAssignments, setLoadedCourseAssignments] = useState();
  // const [submissionFile, setSubmissionFile] = useState();
  const [selectedAssId, setSelectedAssId] = useState();
  const [component, setComponent] = useState(<div></div>);
  const getToken = localStorage.getItem("token");

  // const uploadSubmission = async (event) => {
  //   event.preventDefault();
  //   try {
  //     let url;
  //     url =
  //       "http://localhost:5000/api/teachers/upload-course-assignment/" +
  //       courseID;
  //     const formData = new FormData();
  //     formData.append("file", submissionFile);
  //     await sendRequest(url, "POST", formData, {
  //       Authorization: "Bearer " + localStorage.getItem("token"),
  //     });

  //     // navigate("/");
  //   } catch (error) {}
  // };

  // console.log(courseID);

  let url =
    "http://localhost:5000/api/students/get-completed-and-due-assignments/" +
    courseID;

  console.log(url);

  useEffect(() => {
    const fetchCourseAssignments = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedCourseAssignments(responseData.dueAssignments);
        setComponent(
          <Grid container spacing={1}>
            {responseData.dueAssignments.map((assignment) => (
              <Grid item xs={12}>
                <CardActionArea
                  onClick={(e) => {
                    setSelectedAssId(assignment._id);
                  }}
                >
                  <Card
                    style={{
                      minWidth: 275,
                      height: "80%",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    {/* <Card sx={{ minWidth: 275 }}> */}
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ fontSize: 21 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {assignment.title}
                      </Typography>

                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {assignment.title}
                      </Typography>
                      {/* make it bold */}
                      <Typography
                        variant="h5"
                        sx={{ mb: 1.5, font: "caption" }}
                        color="text.secondary"
                      >
                        {formatDate(assignment.dueDate)}
                      </Typography>
                    </CardContent>
                    {/* <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions> */}
                  </Card>
                </CardActionArea>
              </Grid>
            ))}
          </Grid>
        );
        // console.log(responseData.courseAssignments);
      } catch (err) {}
    };
    fetchCourseAssignments();

    // });
  }, [sendRequest, url, getToken]);

  useEffect(() => {
    setComponent(
      <SubmissionPanel assignmentId={selectedAssId} studentId={studentId} />
    );
    console.log("assignment selected: ", selectedAssId);
  }, [selectedAssId]);

  const formatDate = (date) => {
    // format to i.e 6 jan, saturday at 3:00pm
    var d = new Date(date);
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var n = weekday[d.getDay()];
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";

    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var mon = month[d.getMonth()];
    var day = d.getDate();
    var year = d.getFullYear();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var date = n + ", " + mon + +day + ", " + year + " at " + h + ":" + m;
    return date;
  };

  return (
    <div>{component}</div>
    // <>
    // {
    /* {loadedCourseAssignments &&
        loadedCourseAssignments.map((assignment) => {
          return (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              courseTitle={courseTitle} */
    // }
    // />
    //       <Grid container spacing={1} key={assignment._id}>
    //         <Grid item xs={12}>
    //           {/* set card background to linear ash color */}
    //           <CardActionArea>
    //             <Card
    //               style={{
    //                 minWidth: 275,
    //                 height: "80%",
    //                 backgroundColor: "#f5f5f5",
    //               }}
    //             >
    //               {/* <Card sx={{ minWidth: 275 }}> */}
    //               <CardContent>
    //                 <Typography
    //                   sx={{ fontSize: 14 }}
    //                   color="text.secondary"
    //                   gutterBottom
    //                 >
    //                   {courseTitle}
    //                 </Typography>

    //                 <Typography sx={{ mb: 1.5 }} color="text.secondary">
    //                   <a href={assignment.file} download>
    //                     {assignment.title}
    //                   </a>
    //                 </Typography>
    //                 <Typography sx={{ mb: 1.5 }} color="text.secondary">
    //                   Deadline :{new Date(assignment.dueDate).toString()}
    //                   {/* {format(assignment.dueDate, "MMMM do, yyyy H:mma")} */}
    //                 </Typography>
    //                 <Grid item container>
    //                   <Grid item sm={3} />
    //                   <Grid item>
    //                     <TextField
    //                       id="outlined-basic"
    //                       label="Description"
    //                       variant="outlined"
    //                       multiline
    //                       maxRows={10}
    //                       sx={{ minWidth: 600, bgcolor: "#f5f5f5" }}
    //                       // value={desc}
    //                       onChange={(e) => setSubmissionFile(e.target.value)}
    //                     />
    //                   </Grid>
    //                   <Grid item sm={3} />
    //                 </Grid>
    //                 <Grid item container>
    //                   <Grid item sm={5} />
    //                   <Grid item>
    //                     <Button
    //                       variant="contained"
    //                       color="primary"
    //                       // align="left"
    //                       style={{
    //                         marginTop: "20px",
    //                         marginBottom: "20px",
    //                         align: "left",
    //                       }}
    //                       // onClick={uploadSubmission}
    //                     >
    //                       Upload Submission
    //                     </Button>
    //                   </Grid>
    //                   <Grid item sm={5} />
    //                 </Grid>
    //               </CardContent>
    //               {/* <CardActions>
    //   <Button size="small">Learn More</Button>
    // </CardActions> */}
    //             </Card>
    //           </CardActionArea>
    //         </Grid>
    //       </Grid>
    // );
    // })}
    // </>
  );
};

export default DueAssignment;
