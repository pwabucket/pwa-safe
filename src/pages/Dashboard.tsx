import { HiOutlineBars3, HiOutlinePlus } from "react-icons/hi2";
import { Link } from "react-router";
import { ReactTyped } from "react-typed";
import { Reorder } from "motion/react";
import { useMemo, useState } from "react";

import AppLayout from "../layouts/AppLayout";
import Card from "../components/Card";
import EntryItem from "../components/EntryItem";
import Input from "../components/Input";
import ReorderItem from "../components/ReorderItem";
import WindowOpenerHandler from "../components/WindowOpenerHandler";
import useAppStore from "../store/useAppStore";
import { HeaderButton } from "../layouts/HeaderButton";
import { searchProperties } from "../lib/utils";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const entries = useAppStore((state) => state.entries);
  const setEntries = useAppStore((state) => state.setEntries);
  const filteredEntries = useMemo(
    () => (search ? searchProperties(entries, search, ["title"]) : entries),
    [entries, search]
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
            <span className="text-green-300 text-2xl">{entries.length}</span>
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
          <p className="bg-green-500/5 text-green-500 p-4 text-center">
            No entries found. Click the button above to create your first entry.
          </p>
        ) : (
          <>
            <Input
              placeholder="Search entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Reorder.Group
              values={entries}
              onReorder={(newOrder) => setEntries(newOrder)}
              className="flex flex-col gap-4"
            >
              {filteredEntries.map((entry) => (
                <ReorderItem
                  key={entry.id}
                  value={entry}
                  hideHandle={Boolean(search)}
                >
                  <EntryItem entry={entry} />
                </ReorderItem>
              ))}
            </Reorder.Group>
          </>
        )}
      </AppLayout>
    </>
  );
}
