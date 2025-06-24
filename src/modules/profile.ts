import { getAuth, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { initFirebase } from "./firebase";
import { renderLoginPage } from "./login";
import { renderUserList } from "./users";

const { auth, db } = initFirebase();

export async function renderProfilePage(userEmail: string) {
  const app = document.getElementById("app") as HTMLDivElement;
  const userQuery = query(collection(db, "users"), where("email", "==", userEmail));
  const userSnap = await getDocs(userQuery);
  const userData = userSnap.docs[0]?.data();
  const avatar = userData?.avatar;

  const postsQuery = query(collection(db, "posts"), where("email", "==", userEmail));
  const postsSnap = await getDocs(postsQuery);
  const posts = postsSnap.docs.map(doc => doc.data().text);

  app.innerHTML = `
    <div class="app-layout">
      <div class="profile-card">
        <img src="${avatar}" alt="Avatar" />
        <p class="logged-in-tag">Inloggad som: ${userEmail}</p>
        <button id="logoutBtn">Logga ut</button>
        <button id="deleteBtn">Radera konto</button>
      </div>

      <div style="flex:1">
        <form id="statusForm" class="status-form">
          <textarea id="statusInput" placeholder="Skriv något..."></textarea>
          <button type="submit">Lägg upp</button>
        </form>
        <div id="postList">
          ${posts.map(p => `<div class="status-post">${p}</div>`).join("")}
        </div>
      </div>

      <div class="user-list" id="userListContainer">
        <h3>Andra användare</h3>
        <!-- Lista laddas här -->
      </div>
    </div>
  `;

  renderUserList("userListContainer");

  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    await signOut(auth);
    localStorage.removeItem("loggedInUser");
    renderLoginPage();
  });

  document.getElementById("deleteBtn")?.addEventListener("click", async () => {
    const confirmDelete = confirm("Är du säker på att du vill radera ditt konto?");
    if (!confirmDelete) return;

    const user = auth.currentUser;
    if (user) {
      const userDoc = userSnap.docs[0];
      await deleteDoc(doc(db, "users", userDoc.id));
      await user.delete();
      localStorage.removeItem("loggedInUser");
      renderLoginPage();
    }
  });

  document.getElementById("statusForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const input = document.getElementById("statusInput") as HTMLTextAreaElement;
    if (input.value.trim() === "") return;

    await addDoc(collection(db, "posts"), {
      email: userEmail,
      text: input.value,
      created: new Date().toISOString(),
    });

    renderProfilePage(userEmail);
  });
}
