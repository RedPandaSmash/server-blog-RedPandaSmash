//import Router from Express library
import { error } from "console";
import { Router } from "express";
//import fs from Node.js, creating a usable instance (ES Modules syntax)
import fs from "fs";
// create instead of Router feature
const router = Router();

//get all comments from  blog.json file. /api/routes
router.get("/", (req, res) => {
  try {
    const allComments = JSON.parse(fs.readFileSync("./api/blog.json", "utf8"));
    res.status(200).json(allComments);
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

//get one comment  by its post_id /api/routes/:post_id
router.get("/:post_id", async (req, res) => {
  try {
    const postID = req.params.post_id;
    const allComments = JSON.parse(fs.readFileSync("./api/blog.json", "utf8"));
    const specificComment = allComments.find(
      (comment) => String(comment.post_id) === String(postID)
    );
    if (!specificComment) {
      res.status(404).json({ error: "that comment does not exist" });
    } else {
      res.status(200).json(specificComment);
    }
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

//post: create a new entry which will be appended to the .json file's outermost array. /api/routes/new
router.post("/new", async (req, res) => {
  try {
    const allComments = JSON.parse(fs.readFileSync("./api/blog.json", "utf8"));
    const newComment = {
      post_id: allComments.length + 1,
      title: req.body.title,
      author: req.body.author,
      body: req.body.body,
    };
    // validation check
    if (!req.body.title || !req.body.author || !req.body.body) {
      res
        .status(500)
        .json({ error: "all required information is not entered" });
    } else {
      allComments.push(newComment);
      fs.writeFileSync("./api/blog.json", JSON.stringify(allComments), "utf8");
      res.status(200).json({ "new comment successfully added": newComment });
    }
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

//put: update an existing entry once a match has been found. The search should be done via a query parameter, whereas update information should be enclosed within the body. /api/routes/:post_id
router.put("/:post_id", async (req, res) => {
  try {
    let allComments = JSON.parse(fs.readFileSync("./api/blog.json", "utf8"));
    //if param post_id is invalid, give feedback that the post to be replaced does not exist
    if (req.params.post_id < 1 || req.params.post_id > allComments.length) {
      res
        .status(404)
        .json({ error: "The comment you want to replace does not exist" });
    }
    //if comment does exist, replace the object with that post_id with the new information, while maintaining the same post_id, but first check that all required fields are entered
    else if (!req.body.title || !req.body.author || !req.body.body) {
      res
        .status(500)
        .json({ error: "all required information is not entered" });
    } else {
      allComments[parseInt(req.params.post_id) - 1] = {
        post_id: parseInt(req.params.post_id),
        title: req.body.title,
        author: req.body.author,
        body: req.body.body,
      };
      fs.writeFileSync("./api/blog.json", JSON.stringify(allComments), "utf8");
      res.status(200).json({
        "comment successfully replaced":
          allComments[parseInt(req.params.post_id) - 1],
      });
    }
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

// delete an entry from our blog.json file. This should be done thru the utilization of the parameter. /api/routes/:post_id
router.delete("/:post_id", async (req, res) => {
  try {
    let allComments = JSON.parse(fs.readFileSync("./api/blog.json", "utf8"));
    // optimization could have been applied to previous methods, but capture post_id param as a variable to avoid rewriting code
    const postID = parseInt(req.params.post_id);
    // select object to change by index that contains the correct post_id key value pair, not simply by passing in the post_id param as the index value. will be important for updating post numbers when deleting posts. To be clear, commentToDelete is the index number of the comment, not the comment itself.
    const commentToDelete = allComments.findIndex(
      (comment) => comment.post_id === postID
    );
    // check that comment exists
    if (commentToDelete === -1) {
      res
        .status(404)
        .json({ error: "The comment you want to delete does not exist" });
    } else {
      // store the actual comment that is being deleted for display when comment is deleted.
      const deletedComment = allComments[commentToDelete];

      // update .json file by filtering objects that aren't the target comment. could also have used splice and that would have made more sense.
      allComments = allComments.filter((comment) => comment.post_id !== postID);
      // update post_id values
      allComments.forEach((comment, index) => {
        comment.post_id = index + 1;
      });
      fs.writeFileSync("./api/blog.json", JSON.stringify(allComments), "utf8");
      res.status(200).json({ "comment successfully deleted": deletedComment });
    }
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

//export router
export default router;
