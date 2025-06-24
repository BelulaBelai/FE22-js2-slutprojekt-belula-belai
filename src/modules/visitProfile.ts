import { collection, getDocs, query, where } from "firebase/firestore";
import { initFirebase } from "./firebase";
import { renderProfilePage } from "./profile";
import { renderUserList } from "./users";

const { db } = initFirebase();

export async function renderUserProfile(email: string) {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const userQuery = query(collection(db, "users"), where("email", "==", email));
  const userSnap = await getDocs(userQuery);
  const userData = userSnap.docs[0]?.data();
  const avatar = userData?.avatar;

  const postsQuery = query(collection(db, "posts"), where("email", "==", email));
  const postsSnap = await getDocs(postsQuery);
  const posts = postsSnap.docs.map(doc => doc.data().text);

  const app = document.getElementById("app") as HTMLDivElement;
  app.innerHTML = `
    <div class="app-layout">
      <div class="profile-card">
        <img src="${avatar}" alt="Avatar" />
        <p class="logged-in-tag">${email}</p>
        <button id="backBtn">⬅ Tillbaka till min profil</button>
      </div>

      <div style="flex:1">
        <div class="status-form" style="text-align:center; padding: 1rem;">
          <h3>Inlägg från ${email}</h3>
        </div>
        <div id="postList">
          ${posts.map(p => `<div class="status-post">${p}</div>`).join("")}
        </div>
      </div>

      <div class="user-list" id="userListContainer">
        <h3>Andra användare</h3>
        <!-- Listan laddas här -->
      </div>
    </div>
  `;

  renderUserList("userListContainer");

  document.getElementById("backBtn")?.addEventListener("click", () => {
    if (loggedInUser) {
      renderProfilePage(loggedInUser);
    }
  });
}
