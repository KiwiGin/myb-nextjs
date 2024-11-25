import Image from "next/image";
import logoutIcon from "../../assets/logout.svg";

export function Logout() {
  return <Image src={logoutIcon} alt="Arrow" width={32} height={32} />;
}
