// @ts-ignore
import Cometogether from "../sounds/cometogether.mp3";
// @ts-ignore
import CuckooClock from "../sounds/cuckooclock.mp3";
// @ts-ignore
import Getupstandup from "../sounds/getupstandup.mp3";
// @ts-ignore
import Gong from "../sounds/gong.mp3";
// @ts-ignore
import Indianbell from "../sounds/indianbell.mp3";
// @ts-ignore
import Singingbowl from "../sounds/singingbowl.mp3";
// @ts-ignore
import ShaolinGong from "../sounds/shaolingong.mp3";

const Sounds: any[] = [
  {
    id: 0,
    name: "silent",
    title: "Sound OFF",
    path: "",
    hosts: ["localhost", "timebox-test.donhubi.ch", "timebox.innoarchitects.ch"]
  },
  {
    id: 1,
    name: "cometogether",
    path: Cometogether,
    title: "Come together",
    hosts: ["localhost"]
  },
  {
    id: 2,
    name: "cuckooclock",
    title: "Cuckoo Clock",
    path: CuckooClock,
    hosts: ["localhost", "timebox-test.donhubi.ch", "timebox.innoarchitects.ch"]
  },
  {
    id: 3,
    name: "getupstandup",
    path: Getupstandup,
    title: "Get up, stand up",
    hosts: ["localhost"]
  },
  {
    id: 4,
    name: "gong",
    title: "Gong",
    path: Gong,
    hosts: ["localhost", "timebox-test.donhubi.ch", "timebox.innoarchitects.ch"]
  },
  {
    id: 5,
    name: "indianbell",
    path: Indianbell,
    title: "Indian Bell",
    hosts: ["localhost", "timebox-test.donhubi.ch", "timebox.innoarchitects.ch"]
  },
  {
    id: 6,
    name: "singingbowl",
    path: Singingbowl,
    title: "Singing Bowl",
    hosts: ["localhost", "timebox-test.donhubi.ch", "timebox.innoarchitects.ch"]
  },
  {
    id: 7,
    name: "shaolingong",
    path: ShaolinGong,
    title: "Shaolin Gong",
    hosts: ["localhost", "timebox-test.donhubi.ch", "timebox.innoarchitects.ch"]
  }
];

export default Sounds;
