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

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const CompletedAssignmentCard = (props) => {
  // destructuring the props
  const { assignment, courseTitle } = props;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [submissionFile, setSubmissionFile] = useState();
  const getToken = localStorage.getItem("token");

  const updateSubmission = async (event) => {
    event.preventDefault();
    try {
      let url;
      url =
        "http://localhost:5000/api/students/update-submission/" +
        assignment._id;
      const formData = new FormData();
      formData.append("file", submissionFile);
      await sendRequest(url, "PATCH", formData, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      //
      // navigate("/");
    } catch (error) {
      //
    }
  };

  const deleteSubmission = async (event) => {
    event.preventDefault();
    try {
      let url;
      url =
        "http://localhost:5000/api/students/delete-submission/" +
        assignment._id;
      const formData = new FormData();
      formData.append("file", submissionFile);
      await sendRequest(url, "DELETE", formData, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      //
      // navigate("/");
    } catch (error) {
      //
    }
  };

  const [url, setUrl] = useState();

  return (
    <>
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
                  <a href={assignment.file} download>
                    {assignment.title}
                  </a>
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Deadline :{new Date(assignment.dueDate).toString()}
                  {/* {format(assignment.dueDate, "MMMM do, yyyy H:mma")} */}
                </Typography>
                <Grid item container spacing={2}>
                  <Grid item sm={1} />

                  <Grid item>
                    {/* make a fancy file input button and take the file */}
                    <input
                      type="file"
                      onChange={(e) => setSubmissionFile(e.target.files[0])}
                    />
                    {/* put a text with ash back ground */}

                    <Button variant="contained" color="primary">
                      Attach
                    </Button>
                  </Grid>

                  <Grid item sm={1} />
                </Grid>
                <Grid item container>
                  <Grid item sm={5} />
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      // align="left"
                      style={{
                        marginTop: "20px",
                        marginBottom: "20px",
                        align: "left",
                      }}
                      onClick={updateSubmission}
                    >
                      Update Submission
                    </Button>
                  </Grid>
                  <Grid item sm={5} />
                </Grid>
                <Grid item container>
                  <Grid item sm={5} />
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      // align="left"
                      style={{
                        marginTop: "20px",
                        marginBottom: "20px",
                        align: "left",
                      }}
                      onClick={deleteSubmission}
                    >
                      Delete Submission
                    </Button>
                  </Grid>
                  <Grid item sm={5} />
                </Grid>
              </CardContent>
              {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
            </Card>
          </CardActionArea>
        </Grid>
      </Grid>
    </>
  );
};

export default CompletedAssignmentCard;
