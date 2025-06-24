
import { deleteUser } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { initFirebase } from './firebase';
import { renderLoginPage } from './login';

const { auth, db } = initFirebase();

export async function deleteAccount() {
  const user = auth.currentUser;
  if (!user) return;

  const email = user.email || "";
  const uid = user.uid;

  const postsQuery = query(collection(db, "posts"), where("email", "==", email));
  const postsSnapshot = await getDocs(postsQuery);
  postsSnapshot.forEach(async post => await deleteDoc(post.ref));

  await deleteDoc(doc(db, "users", uid));
  await deleteUser(user);
  localStorage.removeItem("loggedInUser");
  alert("Konto raderat");
  renderLoginPage();
}
