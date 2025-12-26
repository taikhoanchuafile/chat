import { createBrowserRouter, RouterProvider } from "react-router";
import AppRouter from "./AppRouter";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRouter from "./components/auth/ProtectedRouter";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppRouter,
    children: [
      {
        Component: ProtectedRouter,
        children: [{ index: true, Component: HomePage }],
      },
      {
        path: "/signin",
        Component: SignInPage,
      },
      { path: "/signup", Component: SignUpPage },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
