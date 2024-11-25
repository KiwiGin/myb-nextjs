import Image from "next/image";
import arrowIcon from "../../assets/arrow-down.svg";

export function Arrow({ orientation = "right" }) {
  return (
    <div
      className={`flex items-center ${
        orientation === "right" ? "-rotate-90" : "rotate-90"
      }`}
    >
      <Image src={arrowIcon} alt="Arrow" width={32} height={32} />
    </div>
  );
}
