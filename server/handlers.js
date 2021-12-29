"use strict";

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

//get all users in the DB
const getAllUsers = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("final-project");
  const result = await db.collection("users").find().toArray();
  if (result[0]) {
    res.status(200).json({ status: 200, message: "ok", data: result });
  } else {
    res.status(404).json({ status: 404, message: "error", data: result });
  }
  client.close();
};

// get a single user in the DB
const getUserById = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("final-project");
  const _id = req.params._id;
  const result = await db.collection("users").findOne({ _id });
  if (result) {
    res.status(200).json({ status: 200, message: "ok", data: result });
  } else {
    res.status(404).json({ status: 404, message: "error", data: result });
  }

  client.close();
};

// get user when they sign in

const getExistingUser = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("final-project");
  const { email } = req.body;
  const { password } = req.body;
  const result = await db.collection("users").findOne({ email: email });
  if (result) {
    if (result.password === password) {
      res.status(200).json({ status: 200, message: "ok", data: result });
    }
    if (result.password !== password) {
      res.status(401).json({ status: 401, message: "incorrect password" });
    }
  } else {
    res
      .status(404)
      .json({ status: 404, message: "no account associated", data: result });
  }
  client.close();
};

// add user to the DB when they sign up
const addNewUser = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("final-project");
  const { email } = req.body;
  const checkExistingUser = await db
    .collection("users")
    .findOne({ email: email });
  if (checkExistingUser) {
    res.status(401).json({
      status: 401,
      message: "email already in use",
    });
  } else {
    const result = await db.collection("users").insertOne({
      _id: req.body._id,
      name: req.body.name,
      avatar: req.body.avatar,
      bio: req.body.bio,
      forte: req.body.forte,
      rating: req.body.rating,
      ads: req.body.ads,
      reviews: req.body.reviews,
      email: email,
      password: req.body.password,
    });

    result
      ? res.status(200).json({ status: 200, message: "ok", data: req.body })
      : res.status(404).json({ status: 404, message: "error", data: req.body });
  }

  client.close();
};

// update a user when they edit their profile
const updateUser = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("final-project");
  const _id = req.params._id;
  const result = await db.collection("users").updateOne(
    { _id: _id },
    {
      $set: {
        name: req.body.name,
        avatar: req.body.avatar,
        bio: req.body.bio,
        forte: req.body.forte,
        openToTrading: req.body.openToTrading,
      },
    }
  );

  if (result) {
    res.status(200).json({ status: 200, message: "ok", data: req.body });
  } else {
    res.status(404).json({ status: 404, message: "error", data: req.body });
  }
  client.close();
};

const addReview = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("final-project");
    const _id = req.params._id;
    const result = await db.collection("users").updateOne(
      { _id: _id },
      {
        $push: {
          reviews: {
            _id: req.body._id,
            from: req.body.from,
            timestamp: req.body.timestamp,
            rating: req.body.rating,
            body: req.body.body,
          },
        },
      }
    );
    res.status(200).json({ status: 200, message: "ok", data: req.body });
  } catch (error) {
    res.status(404).json({ status: 404, message: "error", data: req.body });
  }
};

const addAd = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("final-project");
    const result = await db.collection("users").updateOne(
      { _id: req.body._id },
      {
        $push: {
          ads: {
            avatar: req.body.avatar,
            name: req.body.name,
            timestamp: req.body.timestamp,
            body: req.body.body,
          },
        },
      }
    );
    res.status(200).json({ status: 200, message: "ok", data: req.body });
  } catch (error) {
    res.status(404).json({ status: 404, message: "error", data: req.body });
  }
};

const getUserAdsByUserId = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("final-project");
  const _id = req.params._id;
  const result = await db.collection("users").findOne({ _id });
  if (result) {
    res.status(200).json({ status: 200, message: "ok", data: result });
  } else {
    res.status(404).json({ status: 404, message: "error", data: result });
  }

  client.close();
};

const getCurrentUserAdsById = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("final-project");
  const _id = req.params._id;
  const result = await db.collection("users").findOne({ _id });
  if (result) {
    res.status(200).json({ status: 200, message: "ok", data: result });
  } else {
    res.status(404).json({ status: 404, message: "error", data: result });
  }

  client.close();
};

module.exports = {
  getAllUsers,
  getUserById,
  addNewUser,
  updateUser,
  getExistingUser,
  addReview,
  addAd,
  getUserAdsByUserId,
  getCurrentUserAdsById,
};
