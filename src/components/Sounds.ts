// @ts-ignore
import Gong from '../sounds/gong.mp3';
// @ts-ignore
import Cometogether from '../sounds/cometogether.mp3';
// @ts-ignore
import Fivesonic from '../sounds/fivesonic.mp3';
// @ts-ignore
import Galaxy from '../sounds/galaxy.mp3';
// @ts-ignore
import Getupstandup from '../sounds/getupstandup.mp3';
// @ts-ignore
import Laidback from '../sounds/laidback.mp3';
// @ts-ignore
import Singingbowl from '../sounds/singingbowl.mp3';

export default [
  {
    id: 0,
    name: 'silent',
    title: 'Sound OFF',
    path: '',
    hosts: [
      'localhost',
      'timebox-test.donhubi.ch',
      'timebox.innoarchitects.ch',
    ],
  },
  {
    id: 1,
    name: 'gong',
    title: 'Gong',
    path: Gong,
    hosts: [
      'localhost',
      'timebox-test.donhubi.ch',
      'timebox.innoarchitects.ch',
    ],
  },
  {
    id: 2,
    name: 'getupstandup',
    path: Getupstandup,
    title: 'Get up, stand up',
    hosts: [
      // 'localhost'
    ],
  },
  {
    id: 3,
    name: 'cometogether',
    path: Cometogether,
    title: 'Come together',
    hosts: [
      // 'localhost'
    ],
  },
  {
    id: 4,
    name: 'fivesonic',
    path: Fivesonic,
    title: '5 Sonic',
    hosts: [
      'localhost',
      'timebox-test.donhubi.ch',
      'timebox.innoarchitects.ch',
    ],
  },
  {
    id: 5,
    name: 'galaxy',
    path: Galaxy,
    title: 'Galaxy',
    hosts: [
      'localhost',
      'timebox-test.donhubi.ch',
      'timebox.innoarchitects.ch',
    ],
  },
  {
    id: 7,
    name: 'laidback',
    path: Laidback,
    title: 'Laidback',
    hosts: [
      'localhost',
      'timebox-test.donhubi.ch',
      'timebox.innoarchitects.ch',
    ],
  },
  {
    id: 8,
    name: 'singingbowl',
    path: Singingbowl,
    title: 'Singing Bowl',
    hosts: [
      'localhost',
      'timebox-test.donhubi.ch',
      'timebox.innoarchitects.ch',
    ],
  },
];
