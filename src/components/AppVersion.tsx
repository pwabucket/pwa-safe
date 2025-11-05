import { SiGithub } from "react-icons/si";
import { Link } from "react-router";

export default function AppVersion() {
  return (
    <div className="flex flex-col gap-1">
      <Link
        target="_blank"
        to={import.meta.env.VITE_APP_REPOSITORY}
        className="flex justify-center items-center gap-2 text-neutral-400 hover:text-green-400 font-bold"
      >
        <SiGithub className="size-5" />
        GitHub
      </Link>
      <p className="text-center text-green-300 text-xs">
        v{import.meta.env.PACKAGE_VERSION}
      </p>
    </div>
  );
}
