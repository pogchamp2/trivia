import TV from "@/components/tv";
import { redirect } from "next/navigation";

function generateRandomWord(): string {
  const words = [
    "smug",
    "bump",
    "wink",
    "zany",
    "mush",
    "guff",
    "biff",
    "poke",
    "jolt",
    "purr",
    "sass",
    "buzz",
    "flop",
    "glib",
    "huff",
    "miff",
    "quip",
    "snip",
    "tush",
    "vamp",
    "wisp",
    "yank",
    "zest",
    "boop",
    "kink",
    "muck",
    "nosh",
    "puff",
    "romp",
    "twit",
  ];
  return words[Math.floor(Math.random() * words.length)];
}

const TvPage = () => {
  redirect(`tv/${generateRandomWord()}`);

  // return (
  //   <TV />
  // )
};

export default TvPage;
