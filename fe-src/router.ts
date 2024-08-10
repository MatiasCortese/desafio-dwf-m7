import { Router } from "@vaadin/router";
import "./pages/home";
import "./pages/home-mascotas";
import "./pages/auth";
import "./pages/auth-login";
import "./pages/auth-register";
import "./pages/report";
import "./pages/report-edit";
import "./pages/me-reported-pets";
import "./pages/me";
import "./pages/me-data";
import "./pages/me-password";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
    // {path: "/", component: "home-page"},
    {path: "/home", component: "home-page"},
    {path: "/home/mascotas", component: "home-mascotas-page"},
    {path: "/auth", component: "auth-page"},
    {path: "/auth/login", component: "login-page"},
    {path: "/auth/register", component: "register-page"},
    {path: "/report", component: "report-page"},
    {path: "/report/:id", component: "report-edit-page"},
    {path: "/me/report", component: "my-reported-pets-page"},
    {path: "/me/password", component: "change-pass-page"},
    {path: "/me/data", component: "change-data-page"},
    {path: "/me", component: "my-profile-page"},
]);

export { router };
