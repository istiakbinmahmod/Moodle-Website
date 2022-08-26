import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Typography,
  Divider,
  CardActionArea,
} from "@material-ui/core";
import { Input, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { AuthContext } from "../../Components/Context/AuthContext";
import { useHttpClient } from "../../Components/Context/http-hook";

import axios from "axios";
import Comment from "./Comment";

const dummyPost =
  "This is a dummy post. First Register as a new user or login in your existing account to add comments or replies. Once logged in you can also edit comments and replies added by you. You will remain logged in for maximum 3 hours after which cookie containing your auth token will expire. I have implemented Depth First Traversal Graph algorithm to get comments from MongoDB and render in React component. Have fun :)";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    backgroundColor: "#181818",
    color: "white",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
}));

const Forum = (props) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const getToken = localStorage.getItem("token");
  const { courseID } = props;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedForumPosts, setLoadedForumPosts] = useState();
  const [postId, setPostId] = useState();

  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [comments, setComments] = useState([]);
  const [isLogged, setIsLogged] = useState(true);
  const [userData, setUserData] = useState({});
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");

  useEffect(() => {
    const url = "http://localhost:5000/api/users/get-all-posts/" + courseID;
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: "Bearer " + getToken,
        });
        setLoadedForumPosts(responseData.posts);
      } catch (err) {}
    };
    fetchPosts();
  }, []);

  const typePostTitle = (e) => {
    setPostTitle(e.target.value);
  };

  const typePostDescription = (e) => {
    setPostDescription(e.target.value);
  };

  const uploadPost = async (event) => {
    event.preventDefault();
    if (postTitle === "" || postDescription === "") {
      return;
    }
    try {
      let url;
      url =
        "http://localhost:5000/api/users/post/" +
        courseID +
        "/" +
        localStorage.getItem("userId");
      alert(url);
      await sendRequest(
        url,
        "POST",
        //    formData,
        JSON.stringify({
          title: postTitle,
          postDescription: postDescription,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      alert("post sent");
      window.location.reload();
      // navigate("/");
    } catch (error) {
      alert("post not sent");
    }
  };

  // const addComment = async () =>
  //   // isReplyComment = false,
  //   // parentComment = null,
  //   // commentText = null
  //   {
  //     // if (isReplyComment === false && commentInput === "") {
  //     //   return;
  //     // }
  //     // if (isReplyComment && commentText === "") {
  //     //   return;
  //     // }
  //     let data = {
  //       id: userData.id,
  //       name: userData.name,
  //       commentText: isReplyComment ? commentText : commentInput,
  //     };
  //     if (isReplyComment) {
  //       data.parentId = parentComment._id;
  //       data.depth = parentComment.depth + 1;
  //     }
  //     // console.log(data);

  //     await axios
  //       .post("/comments/add", data)
  //       .then((response) => {
  //         // console.log(response.data);
  //         setUserData(response.data.user);
  //         response.data.user === null ? setIsLogged(false) : setIsLogged(true);
  //         // getComments(response.data.comments);
  //       })
  //       .catch((err) => {
  //         console.log(err); ////////////
  //       });
  //   };

  const updateComment = async (data) => {
    await axios
      .post("/comments/edit", data)
      .then((response) => {
        // console.log(response.data);
        setUserData(response.data.user);
        response.data.user === null ? setIsLogged(false) : setIsLogged(true);
        // getComments(response.data.comments);
      })
      .catch((err) => {
        console.log(err); ////////////
      });
  };

  return (
    <div>
      <Card className={classes.root}>
        <CardHeader className="text-center" title="Forum" />
        <CardContent className="text-center">
          <Typography variant="h6" component="p">
            {dummyPost}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <Typography
              style={{ color: "#999999" }}
              variant="body1"
              component="p"
            >
              Comments
            </Typography>
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <div>
              <Input
                value={postTitle}
                // disabled={!isLogged}
                multiline
                rowsMin="1"
                maxRows="3"
                placeholder={
                  "Post Title..."
                  //   !isLogged ? "Login to comment" : "Type your comment..."
                }
                style={{ width: "100%", color: "white" }}
                onChange={typePostTitle}
              />
              <Divider />
              <Input
                value={postDescription}
                // disabled={!isLogged}
                multiline
                rowsMin="1"
                maxRows="3"
                placeholder={
                  "Post ..."
                  //   !isLogged ? "Login to comment" : "Type your comment..."
                }
                style={{ width: "100%", color: "white" }}
                onChange={typePostDescription}
              />
              <Button
                size="small"
                // disabled={!isLogged}
                color="primary"
                variant="contained"
                style={{
                  backgroundColor: "#ff0050",
                  marginTop: "1%",
                  color: "black",
                }}
                onClick={uploadPost}
                // onClick={() => addComment()}
              >
                Add New Forum Post
              </Button>
            </div>
            {!isLoading && loadedForumPosts && (
              <div>
                {loadedForumPosts.map((post, index) => (
                  <>
                    <CardActionArea
                      onClick={(e) => {
                        setPostId(post._id);
                      }}
                    >
                      <Comment
                        key={index}
                        id={post._id}
                        post={post}
                        uploadPost={uploadPost}
                        // updateComment={updateComment}
                        // commentData={comment}
                        // userData={userData}
                        // isLogged={isLogged}
                      />
                    </CardActionArea>
                    {/* <Divider /> */}
                  </>
                ))}
              </div>
            )}
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
};

export default Forum;
