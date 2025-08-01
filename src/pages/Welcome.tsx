import { ReactTyped } from "react-typed";

import AppIcon from "../assets/icon.svg";
import Button from "../components/Button";
import { cn } from "../lib/utils";

function Welcome() {
  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-4",
        "min-h-dvh p-4 w-full max-w-md mx-auto"
      )}
    >
      <img src={AppIcon} alt="App Icon" className="size-28 mx-auto" />
      <h1 className="font-audiowide text-4xl text-center">Safe</h1>
      <p className="text-center text-green-500">
        <ReactTyped
          typeSpeed={50}
          backSpeed={50}
          strings={["Welcome Agent", "To your encrypted safe"]}
        />
      </p>

      <Button>Get Started</Button>
    </div>
  );
}

export default Welcome;
