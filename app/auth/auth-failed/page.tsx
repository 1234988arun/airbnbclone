// import AuthFailed from "@/components/auth/AuthFailed";

// const page = () => {
//   return <AuthFailed />;
// };

// export default page;






import Link from "next/link";

interface AuthFailedProps {
  signupRequired?: boolean;
}

const AuthFailed = ({ signupRequired = false }: AuthFailedProps) => {
  return (
    <div className="flex h-[100vh] items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-lg sm:p-10">

        <div className="mb-4 text-4xl sm:mb-5 sm:text-5xl">
          {signupRequired ? "👋" : "⚠️"}
        </div>

        <h1 className="mb-3 text-xl font-semibold text-slate-900 sm:text-3xl">
          {signupRequired ? "Sign Up Required" : "Login Failed"}
        </h1>

        <p className="mx-auto max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          {signupRequired
            ? "You have to sign up first before continuing with Google."
            : "We could not sign you in with Google. Please sign up first before continuing."}
        </p>

        <Link
          href="/signup"
          className="mt-6 inline-flex h-10 w-full max-w-32 items-center justify-center rounded-md bg-[#e51b23] px-6 text-sm font-medium text-white transition hover:bg-[#c9161d] sm:w-auto"
        >
          Sign Up
        </Link>

      </div>
    </div>
  );
};

export default AuthFailed;


