import React, { FC } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const LoginButton: FC = () => {
  const { loginWithRedirect } = useAuth0();

  return <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => loginWithRedirect()}>Log In</button>;
};

export const LogoutButton: FC = () => {
    const { logout } = useAuth0();
  
    return (
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => logout({ returnTo: window.location.origin })}>
        <span>Logout</span>
      </button>
    );
};
  
export {}