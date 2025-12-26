import { useAuthStore } from "@/stores/authStore";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router";

const SignInGG = () => {
  const signInGG = useAuthStore((state) => state.signInGG);
  const navigate = useNavigate();
  const handleloginGG = async (res: any) => {
    await signInGG(res.credential);
    navigate("/");
  };
  return (
    <div id="goole-login-btn">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleLogin onSuccess={handleloginGG}></GoogleLogin>
      </GoogleOAuthProvider>
    </div>
  );
};

export default SignInGG;
