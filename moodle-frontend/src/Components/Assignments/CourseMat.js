import { React, useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  CardActionArea,
  Divider,
  Grid,
  List,
  ListItemButton,
} from "@mui/material";
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
  const [loadedCourseMaterials, setLoadedCourseMaterials] = useState();
  const getToken = localStorage.getItem("token");
  const [materialID, setMaterialID] = useState();

  let url2 =
    localStorage.getItem("userRole") === "student"
      ? "http://localhost:5000/api/students/get-course-materials/" + courseID
      : "http://localhost:5000/api/teachers/get-materials/" + courseID;

  useEffect(() => {
    const fetchCourseMaterials = async () => {
      try {
        const responseData = await sendRequest(url2, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedCourseMaterials(responseData.courseMaterials);
        console.log(responseData.courseMaterials);
      } catch (err) {}
    };
    fetchCourseMaterials();
    // });
  }, [sendRequest, url2, getToken]);

  useEffect(() => {
    if (materialID) {
      const deleteMat = async () => {
        try {
          let url;
          url =
            "http://localhost:5000/api/teachers/delete-material/" + courseID;
          await sendRequest(
            url,
            "DELETE",
            JSON.stringify({
              courseMaterialsId: materialID,
            }),
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            }
          );
          alert("Material Deleted successfully");
          window.location.reload();
        } catch (error) {
          alert("error deleting the file");
        }
      };
      deleteMat();
    }
  }, [materialID]);

  return (
    <List>
      <Divider />
      <Typography mt={2} ml={2} mb={2} variant="h6" style={{ color: "blue" }}>
        Course Material Files
      </Typography>
      <Divider />
      {loadedCourseMaterials &&
        loadedCourseMaterials.map((material) => {
          return (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <CardActionArea
                // onClick={(e) => {
                //   setSelectedAssId(assignment._id);
                // }}
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
                        variant="h7"
                        sx={{ fontSize: 21 }}
                        // color="text.secondary"
                        gutterBottom
                      >
                        {/* Material : */}
                        <a
                          href={material.file}
                          style={{ textDecoration: "none" }}
                        >
                          {material.title}
                        </a>
                      </Typography>
                      <br></br>
                      {localStorage.getItem("userRole") === "teacher" && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => setMaterialID(material._id)}
                        >
                          Delete File
                        </Button>
                      )}
                      {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        <a href={material.file}>{material.title}</a>
                      </Typography> */}
                      {/* make it bold */}
                      {/* <Typography
                        variant="h5"
                        sx={{ mb: 1.5, font: "caption" }}
                        color="text.secondary"
                      >
                        {formatDate(assignment.dueDate)}
                      </Typography> */}
                    </CardContent>
                  </Card>
                </CardActionArea>
              </Grid>
            </Grid>
          );
        })}
    </List>
  );
};

export default CourseMat;
