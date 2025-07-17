import { collection, getDocs, query } from "firebase/firestore";
import { initFirebase } from "./firebase";
import { renderUserProfile } from "./visitProfile";


const { db } = initFirebase();

let cachedUsers: { email: string; avatar: string }[] = [];

export async function renderUserList(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentUser = localStorage.getItem("loggedInUser");

  if (cachedUsers.length === 0) {
    const q = query(collection(db, "users"));
    const snapshot = await getDocs(q);
    cachedUsers = snapshot.docs.map(doc => doc.data() as { email: string; avatar: string });
  }

  const filtered = cachedUsers.filter(user => user.email !== currentUser);

  container.innerHTML = `
  <h3>Användarlista</h3>
    <ul>
      ${filtered
        .map(
          user => `
          <li class="user-item">
            <img src="${user.avatar}" alt="avatar" width="30" />
           <span class="user-link" data-email="${user.email}">${user.email}</span>

          </li>
        `
        )
        .join("")}
    </ul>
  `;

  document.querySelectorAll(".user-link").forEach(btn => {
    btn.addEventListener("click", () => {
      const email = (btn as HTMLElement).dataset.email;
if (email) {
  renderUserProfile(email);
}
    });
  });
}
