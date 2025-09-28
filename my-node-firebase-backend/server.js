const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const bodyParser = require('body-parser');
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-database-name>.firebaseio.com"
});

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Example: Add a new document to Firestore
app.post('/add', async (req, res) => {
  const db = admin.firestore();
  const docRef = db.collection('users').doc('alovelace');

  await docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
  });

  res.send('Document added!');
});

// Example: Get a document from Firestore
app.get('/get', async (req, res) => {
  const db = admin.firestore();
  const docRef = db.collection('users').doc('alovelace');
  const doc = await docRef.get();

  if (!doc.exists) {
    res.send('No such document!');
  } else {
    res.send(doc.data());
  }
});

// Sign Up Route
app.post('/signup', async (req, res) => {
  const { email, password, username, displayName, age } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    res.status(201).send({ uid: userRecord.uid });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).send({ error: error.message });
  }
});

// Sign In Route
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await admin.auth().getUserByEmail(email);
    // Here you would typically verify the password using a library like bcrypt
    // For Firebase, you would use Firebase Client SDK for sign-in
    res.status(200).send({ uid: user.uid });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}); 