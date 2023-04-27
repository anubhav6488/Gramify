const express = require("express");
const router = express.Router();

const cron = require("node-cron");
const environment = process.env.NODE_ENV;
const stage = require("../config")[environment];
const Constants = require("../lib/constants");
const Database = require("../services/database");
const axios = require("axios");
const {
  collection,
  doc,
  setDoc,
  query,
  addDoc,
  getDocs,
  getDoc,
  where,
  collectionGroup,
  startAt,
  orderBy,
  endAt,
  limit,
  startAfter,
  documentId,
  updateDoc,
  serverTimestamp,
  Timestamp,
} = require("firebase/firestore");
const { getStorage, ref, getDownloadURL } = require("firebase/storage");
const fireDB = require("../connections/firebase");
// const db = require("../connections/db");

const async = require("async");
const Constant = require("../lib/constants");
const { firestore } = require("firebase-admin");
const Admin = require("mongodb/lib/admin");
const e = require("express");

// Scheduled Reports
cron.schedule("0 30 12 * * *", () => {});


module.exports = router;
