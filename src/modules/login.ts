import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { initFirebase } from './firebase';

const { auth, db } = initFirebase();
const app = document.getElementById('app') as HTMLDivElement;

export function renderLoginPage() {
  app.innerHTML = `
  <div class="login-card">
    <h2>Logga In</h2>
    <input type="email" id="email" placeholder="E-post" />
    <input type="password" id="password" placeholder="Lösenord" />
    <button id="loginBtn">Logga in</button>
    <a href="#" id="registerLink">Skapa Användare</a>
  </div>
`;


  document.getElementById('loginBtn')?.addEventListener('click', () => {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        localStorage.setItem("loggedInUser", email);
        location.reload();
      })
      .catch(err => {
        alert("Inloggning misslyckades: " + err.message);
      });
  });

  document.getElementById('registerLink')?.addEventListener('click', () => {
    renderRegisterPage();
  });
}

function renderRegisterPage() {
  app.innerHTML = `
  <div class="register-card">
    <h2>Registrera</h2>
    <input type="email" id="newEmail" placeholder="E-post" />
    <input type="password" id="newPassword" placeholder="Lösenord" />
    <p>Välj en profilbild:</p>
    <div class="avatar-options">
      <label>
        <input type="radio" name="avatar" value="https://api.dicebear.com/9.x/fun-emoji/svg?seed=Leah" checked />
        <img src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=Leah" />
      </label>
      <label>
        <input type="radio" name="avatar" value="https://api.dicebear.com/9.x/fun-emoji/svg?seed=Liam" />
        <img src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=Liam" />
      </label>
      <label>
        <input type="radio" name="avatar" value="https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery" />
        <img src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery" />
      </label>
    </div>
    <button id="registerBtn">Skapa konto</button>
    <button id="backBtn">Tillbaka</button>
  </div>
`;


  document.getElementById("registerBtn")?.addEventListener("click", async () => {
    const email = (document.getElementById("newEmail") as HTMLInputElement).value;
    const password = (document.getElementById("newPassword") as HTMLInputElement).value;
    const avatar = (document.querySelector('input[name="avatar"]:checked') as HTMLInputElement).value;

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), { email, avatar });
      alert("Användare skapad!");
      location.reload();
    } catch (err: any) {
      alert("Fel: " + err.message);
    }
  });

  document.getElementById('backBtn')?.addEventListener('click', () => {
    renderLoginPage();
  });
}


