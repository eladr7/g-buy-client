import React, { FormEvent, useEffect, useState } from "react";
import { laptopsStore } from "./context/CategoryStore";
import { secretjsStore } from "./context/SecretjsStore";

interface LoginProps {
  setViewingKey: (viewingKey: string) => void;
}
export const Login: React.FC<LoginProps> = ({ setViewingKey }) => {
  const [address, setAddress] = useState<string>("");
  const [viewingKeyInput, setViewingKeyInput] = useState<string>("");

  // const navigateToMainPage = () => {
  //   history.push("/main");
  //   history.go(0);
  // };

  useEffect(() => {
    // localStorage.setItem("viewing-key", "");
    // const viewingKey = localStorage.getItem("viewing-key");
    // if (viewingKey) {
    //   navigateToMainPage();
    //   return;
    // }

    if (secretjsStore.secretjs) {
      setAddress(secretjsStore.secretjs.address);
    }
  }, [secretjsStore.secretjs]);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let addedSuccessfully = await laptopsStore.setViewingKeyInServer(
      secretjsStore.secretjs,
      secretjsStore.contractHash,
      viewingKeyInput
    );

    if (addedSuccessfully) {
      localStorage.setItem("viewing-key", viewingKeyInput);
      setViewingKey(viewingKeyInput);
      // navigateToMainPage();
      return;
    }

    alert("Setting the viewing key failed");
  };

  return (
    <div className="center">
      <div className="card">
        <h1>Login</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            placeholder="Your account address"
            name="account-address"
            type="text"
            readOnly
            value={address}
          />
          <label htmlFor="viewing-key">
            Choose your viewing key and keep it somewhere secure
          </label>
          <input
            placeholder="Set your viewing key"
            name="viewing-key"
            type="text"
            onChange={(e) => setViewingKeyInput(e.target.value)}
          />
          <input className="form-submit" value="SUBMIT" type="submit" />
        </form>
      </div>
    </div>
  );
};
