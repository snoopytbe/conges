import React, { useEffect, useState } from "react";
import Calendrier from "./Calendrier";
import { Amplify } from "aws-amplify";
import { signInWithRedirect } from "aws-amplify/auth";
import Button from "@mui/material/Button";
import './theme.css';

import { awsConnect } from "./awsConnect";

import config from "./amplifyconfiguration.json";

const ADMIN_USER_ID = process.env.REACT_APP_ADMIN_USER_ID;

Amplify.configure(config);

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Connexion AWS de l'utilisateur
    awsConnect(setUser);
  }, []);

  return (
    <div className="App">
      {user?.userId == ADMIN_USER_ID ? (
        <Calendrier />
      ) : (
        <Button
          variant="secondary"
          color="primary"
          onClick={() => signInWithRedirect({ provider: "Google" })}
        >
          Connexion
        </Button>
      )}
    </div>
  );
}
