interface AuthFailedProps {
  signupRequired?: boolean;
}

const AuthFailed = ({ signupRequired = false }: AuthFailedProps) => {
  return (
    <div>
      <h1>Authentication Failed</h1>

      <p>
        {signupRequired &&
           "We could not sign you in with Google.You have to sign up first before continuing with Google "}
      </p>
    </div>
  );
};

export default AuthFailed;
