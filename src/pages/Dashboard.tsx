import {
  HiOutlineBars3,
  HiOutlineExclamationTriangle,
  HiOutlinePlus,
} from "react-icons/hi2";
import { useMemo, useState } from "react";

import AppLayout from "../layouts/AppLayout";
import Card from "../components/Card";
import EntryItem from "../components/EntryItem";
import { HeaderButton } from "../layouts/HeaderButton";
import Input from "../components/Input";
import { Link } from "react-router";
import { MdOutlineSearch } from "react-icons/md";
import { ReactTyped } from "react-typed";
import { Reorder } from "motion/react";
import WindowOpenerHandler from "../components/WindowOpenerHandler";
import { searchProperties } from "../lib/utils";
import useAppStore from "../store/useAppStore";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const entries = useAppStore((state) => state.entries);
  const setEntries = useAppStore((state) => state.setEntries);
  const filteredEntries = useMemo(
    () => (search ? searchProperties(entries, search, ["title"]) : entries),
    [entries, search],
  );
  return (
    <>
      <WindowOpenerHandler />
      <AppLayout
        headerLeftContent={
          <HeaderButton icon={HiOutlineBars3} as={Link} to="/menu" />
        }
        headerRightContent={
          <HeaderButton icon={HiOutlinePlus} as={Link} to="/entries/create" />
        }
        className="gap-4"
      >
        <div className="grid grid-cols-3">
          <Card className="flex flex-col gap-2">
            <span className="text-green-300 text-4xl font-audiowide">
              {entries.length}
            </span>
            <p className="text-green-100 text-xs">
              <ReactTyped
                strings={["Entries"]}
                typeSpeed={20}
                showCursor={false}
              />
            </p>
          </Card>
        </div>

        {entries.length === 0 ? (
          <p className="bg-green-500/5 text-green-500 p-4 text-center text-sm">
            No entries found. Click the button above to create your first entry.
          </p>
        ) : (
          <>
            {/* Warning Message */}
            <div className="bg-green-500/5 text-green-500 p-4 flex gap-2 text-sm">
              <HiOutlineExclamationTriangle className="size-8 shrink-0" />
              <p className="text-sm">
                All entries are stored within your browser. Ensure to export
                your entries regularly.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full flex flex-col">
              {/* Search Icon */}
              <span className="absolute top-0 left-0 w-10 h-full flex items-center justify-center">
                <MdOutlineSearch className="size-6 text-neutral-500" />
              </span>

              {/* Input */}
              <Input
                type="search"
                name="search-entry"
                placeholder="Search entries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Reorder.Group
              values={entries}
              onReorder={(newOrder) => setEntries(newOrder)}
              className="flex flex-col gap-2"
            >
              {filteredEntries.map((entry) => (
                <EntryItem key={entry.id} entry={entry} />
              ))}
            </Reorder.Group>
          </>
        )}
      </AppLayout>
    </>
  );
}
