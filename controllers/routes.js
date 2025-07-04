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
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});
// delete an entry from our blog.json file. This should be done thru the utilization of the parameter.

//export router
export default router;
