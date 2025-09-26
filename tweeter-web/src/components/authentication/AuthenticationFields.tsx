import { useState } from "react";

interface Props {
  onSubmit: (alias: string, password: string) => void;
  onFieldChange?: (alias: string, password: string) => void;
}

const AuthFields = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !checkSubmitButtonStatus()) {
      props.onSubmit(alias, password); // Call the passed function
    }
  };

  const handleAliasChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAlias = event.target.value;
    setAlias(newAlias);
    if (props.onFieldChange) {
      props.onFieldChange(newAlias, password);
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    if (props.onFieldChange) {
      props.onFieldChange(alias, newPassword);
    }
  };

  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onKeyDown={handleKeyDown}
          onChange={handleAliasChange}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          placeholder="Password"
          onKeyDown={handleKeyDown}
          onChange={handlePasswordChange}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthFields;
