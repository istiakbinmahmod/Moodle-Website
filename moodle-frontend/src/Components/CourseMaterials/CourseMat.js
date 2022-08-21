import { Grid, Typography, Card, CardContent } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import NoticeIcon from "@mui/icons-material/Campaign";
// import Typography from "@mui/material/Typography";
import React, { useState, useEffect, useRef } from "react";
// import useStyles from "../Scores/Style";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AuthContext } from "../Context/AuthContext";
import { useHttpClient } from "../Context/http-hook";
import { useParams } from "react-router-dom";
import Declarations from "./Declarations";
import { makeStyles } from "@mui/styles";
const useStyles = makeStyles((theme) => ({
  app: {
    height: "100vh",
    padding: 20,
  },
  root: {
    display: "flex",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap",
    },
    flexWrap: "nowrap",
  },
  panel: {
    flexGrow: 1,
    padding: 10,
    [theme.breakpoints.down("sm")]: {
      height: "50%",
    },
  },
  scrollable: {
    overflow: "auto",
  },
}));

let materials = [];

const CourseMat = (props) => {
  const { courseID } = props;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourseMaterials, setLoadedCourseMaterials] = React.useState();
  const getToken = localStorage.getItem("token");

  const [materialID, setMaterialID] = React.useState(1);
  const [material, setMaterial] = React.useState([]);

  const getMaterialByid = (id) => {
    return materials.find((material) => material.id === id);
  };

  React.useEffect(() => {
    if (materialID !== null && getMaterialByid(materialID) !== undefined) {
      setMaterial(getMaterialByid(materialID));
    }
  }, [materialID]);

  let url =
    "http://localhost:5000/api/students/get-course-materials/" + courseID;

  useEffect(() => {
    const fetchCourseMaterials = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        console.log(responseData);
        responseData.courseMaterials.map((x) => {
          materials.push({ id: x._id, name: x.title, url: x.file });
        });
        console.log(materials.map((x) => x.url));
        setLoadedCourseMaterials(responseData.courseMaterials);
      } catch (err) {}
    };
    fetchCourseMaterials();
  }, [sendRequest, url, getToken]);

  return (
    // make grid of 30%:70%
    // <Box style={{maxHeight: '100vh', overflow: 'auto'}}>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={3}>
        <Paper className="paper" style={{ maxHeight: 640, overflow: "auto" }}>
          {/* make list items scrollable */}

          <List
            sx={{
              width: "100%",
              maxWidth: "100%",
              bgcolor: "background.paper",
              maxHeight: "100%",
              overflow: "auto",
            }}
          >
            {materials.map((material) => (
              <React.Fragment>
                <Divider />
                {/* <CardActionArea href="#"> */}
                <ListItem
                  button
                  key={material.id}
                  alignItems="flex-start"
                  onClick={() => {
                    // console.log("Notice id: ", notice.id);
                    setMaterialID(material.id);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <NoticeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={material.name}
                    secondary={material.name}
                  />
                </ListItem>
                {/* </CardActionArea> */}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Paper className="paper">
          {/* allign it to center */}

          <Typography
            variant="h5"
            style={{
              justifyContent: "center",
              paddingTop: "20px",
              paddingLeft: "15px",
            }}
          >
            {material.name}
          </Typography>

          <Typography
            component="p"
            style={{ paddingLeft: "15px", paddingBottom: "20px" }}
          >
            {material.name}
          </Typography>

          {/* fetch a pdf file from url and show it */}
          <iframe
            // src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            // src="https://firebasestorage.googleapis.com/v0/b/moodle…=media&token=64d35d84-af48-4fca-9f3d-827ff163541e"
            // src={`http://docs.google.com/gview?embedded=true&url=${material.url}`}
            src={material.url}
            style={{ width: "100%", height: "500px" }}
          ></iframe>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CourseMat;
