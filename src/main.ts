import '../public/style.css'; 
import { renderLoginPage } from './modules/login';
import { renderProfilePage } from './modules/profile';

const loggedInUser = localStorage.getItem("loggedInUser");

if (loggedInUser) {
  renderProfilePage(loggedInUser);
} else {
  renderLoginPage();
}