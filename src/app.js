const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  /**
   * To pass the tests, the get() method should retrieve all repositories
   */

  // retrieves all repositories and sends it back to the user
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  /**
   * To pass the tests, the post() method:
   *  - should receive title, url, techs from the API call
   *  - should create an object with id, title, url, techs[], likes = 0
   */

  // gets title, url and techs[] from the API call body
  const { title, url, techs } = request.body;

  // creates an repository object with unique id, title, url, techs[] and likes starting from 0
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  // add the new repository to the array of repositories
  repositories.push(repository);

  // return the newly created repository to the user
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  /**
   * To pass the test, the put() method should:
   * change only the title, url and techs for a given id
   */

  // gets the id from the API call URL
  const { id } = request.params;

  // get the index where the object with the given ID is stored.
  // if not object is found, it returns -1
  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    // if no object with that ID was found
    return response.status(400).json({ error: "Repository not found" });
  }

  // this is the same as const title = request.body.title
  // this is the same as const url = request.body.ulr
  const { title, url, techs } = request.body;

  const { likes } = repositories[repoIndex];

  // create a new repository with the information from the API call
  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  /**
   * To pass the test, the delete() method should:
   * delete the repository with the ID given through the API params
   */

  // gets the id from the API call URL
  const { id } = request.params;

  // get the index where the object with the given ID is stored.
  // if not object is found, it returns -1
  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    // if no object with that ID was found
    return response.status(400).json({ error: "Repository not found" });
  }

  /**
   * The splice() takes two params:
   *  1. the index where it will start deleting stuff from the array
   *  2. how many elements should be deleted from that given index
   */
  repositories.splice(repoIndex, 1);

  // this returns only the status message and a blank body
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  /**
   * For this method to pass the test we need increase the like count from a given repository
   */

  // gets the id from the API call URL
  const { id } = request.params;

  // get the index where the object with the given ID is stored.
  // if not object is found, it returns -1
  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    // if no object with that ID was found
    return response.status(400).json({ error: "Repository not found" });
  }

  // gets title, url, techs and likes from the repository with the given id and increment likes
  const { title, url, techs } = repositories[repoIndex];
  let likes = repositories[repoIndex].likes;
  likes++;

  // create a new repository to update the current one
  const updatedRepository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  // replace the current repository with the new one.
  repositories[repoIndex] = updatedRepository;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
