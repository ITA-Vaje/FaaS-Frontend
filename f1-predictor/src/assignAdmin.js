// assignAdmin.js
const admin = require('firebase-admin');

const serviceAccount = require('./../faas-ita-firebase-adminsdk-fbsvc-2b31327fec.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = 'admin@gmail.com'; 

async function assignAdminRole() {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`Admin role assigned to ${email}`);
  } catch (error) {
    console.error('Error assigning admin role:', error);
  }
}

assignAdminRole();
