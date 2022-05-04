import React, { FormEvent, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { SecretNetworkClient, Wallet } from "secretjs";
import { laptopsStore } from "./context/CategoryStore";
import { secretjsStore } from "./context/SecretjsStore";

interface ChildComponentProps extends RouteComponentProps<any> {
  /* other props for ChildComponent */
}
export const Login: React.FC<ChildComponentProps> = () => {
  const history = useHistory();
  // const { secretjs } = useSnapshot(secretjsStore);

  // const { secretjs } = useContext(SecretjsContext);
  const [address, setAddress] = useState<string>("");
  const [viewingKey, setViewingKey] = useState<string>("");

  const navigateToMainPage = () => {
    history.push("/main");
    history.go(0);
  };

  useEffect(() => {
    // localStorage.setItem("viewing-key", "");
    const viewingKey = localStorage.getItem("viewing-key");
    if (viewingKey) {
      navigateToMainPage();
      return;
    }

    if (secretjsStore.secretjs) {
      setAddress(secretjsStore.secretjs.address);
    }
  }, [secretjsStore.secretjs]);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let addedSuccessfully = await laptopsStore.setViewingKeyInServer(
      secretjsStore.secretjs,
      secretjsStore.contractHash,
      viewingKey
    );

    if (addedSuccessfully) {
      localStorage.setItem("viewing-key", viewingKey);
      navigateToMainPage();
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
            onChange={(e) => setViewingKey(e.target.value)}
          />
          <input className="form-submit" value="SUBMIT" type="submit" />
        </form>
      </div>
    </div>
  );
};
