import { HiOutlinePlus } from "react-icons/hi2";
import { Link } from "react-router";

import AppLayout from "../layouts/AppLayout";
import { HeaderButton } from "../layouts/HeaderButton";

export default function Dashboard() {
  return (
    <AppLayout
      headerRightContent={
        <HeaderButton icon={HiOutlinePlus} as={Link} to="/entries/create" />
      }
    ></AppLayout>
  );
}
