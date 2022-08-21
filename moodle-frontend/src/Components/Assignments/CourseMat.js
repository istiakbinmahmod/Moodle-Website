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

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const CourseMat = (props) => {
  // destructuring the props
  const { courseTitle, courseID, studentId } = props;
  // alert(courseTitle);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourseAssignments, setLoadedCourseAssignments] = useState();
  const getToken = localStorage.getItem("token");

  let url2 =
    // localStorage.getItem("userRole") === "student"
    //   ?
    "http://localhost:5000/api/students/get-course-materials/" + courseID;
  //   : "http://localhost:5000/api/teachers/get-all-course-assignment/" +
  //     courseID;

  useEffect(() => {
    const fetchCourseAssignments = async () => {
      try {
        const responseData = await sendRequest(url2, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedCourseAssignments(responseData.courseMaterials);
        console.log(responseData.courseMaterials);
      } catch (err) {}
    };
    fetchCourseAssignments();
    // });
  }, [sendRequest, url2, getToken]);

  return (
    <>
      {loadedCourseAssignments &&
        loadedCourseAssignments.map((assignment) => {
          return (
            <Grid container spacing={1} key={assignment._id}>
              <Grid item xs={12}>
                {/* set card background to linear ash color */}
                <CardActionArea>
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
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {courseTitle}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        <a href={assignment.file}>{assignment.title}</a>
                      </Typography>
                    </CardContent>
                    {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
                  </Card>
                </CardActionArea>
              </Grid>
            </Grid>
          );
        })}
    </>
  );
};

export default CourseMat;
