// How to run:
//     npm run generate-data
import { promises as fs } from 'fs';
import path from 'path';

const IMAGE_FILEPATH_PREFIX = 'images/employees';
const TARGET_FILE = path.join(process.env.DB_PATH, 'employees.json');

const IMAGES = await fs.readdir('public/images/employees');
const F_IMAGES = IMAGES.filter((imageName) => imageName.startsWith('f'));
const M_IMAGES = IMAGES.filter((imageName) => imageName.startsWith('m'));
const N_IMAGES = IMAGES.filter((imageName) => imageName.startsWith('n'));

const getRandomImage = (gender) => {
  const genderedImages = gender === 'f' ? F_IMAGES : M_IMAGES;
  const images = genderedImages.concat(N_IMAGES);
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

const rawJobs = await fs.readFile('db/data/random-jobs.txt');
const jobArray = rawJobs.toString().split('\n');
const JOBS = jobArray.map((jobLine) => {
  const [teamName, jobTitle] = jobLine.split(',');
  if (!teamName || !jobTitle)
    throw new Error(
      `Did not find team name and/or job title from this line: ${jobLine}`,
    );
  return { teamName, jobTitle };
});

const getRandomJob = () => {
  const index = Math.floor(Math.random() * JOBS.length);
  return JOBS[index];
};

const rawBadges = await fs.readFile('db/badges.json');
const BADGE_IDS = JSON.parse(rawBadges.toString()).map((badge) => badge.id);

const getRandomBadges = () => {
  let badgeCount = Math.floor(Math.random() * 6);
  const badgeIds = [];
  const allBadgeIds = [...BADGE_IDS].sort(() => Math.random() - 0.5);
  while (badgeCount > 0) {
    badgeIds.push(allBadgeIds.pop());
    badgeCount -= 1;
  }
  return badgeIds;
};

const names = await fs.readFile('db/data/random-names.txt');
const namesArray = names.toString().split('\n');
const employees = namesArray.map((name, index) => {
  const [wholeName, gender] = name.split(',');
  const [firstName, lastName] = wholeName.split(' ');
  const { teamName, jobTitle } = getRandomJob();

  if (gender !== 'f' && gender !== 'm') throw Error(`bad gender: ${name}`);
  const imageFileName = getRandomImage(gender);
  const imageFilePath = `${IMAGE_FILEPATH_PREFIX}/${imageFileName}`;
  return {
    id: index + 1,
    firstName,
    lastName,
    imageFilePath,
    teamName,
    jobTitle,
    badgeIds: getRandomBadges(),
  };
});

const jsonData = JSON.stringify(employees);
await fs.writeFile(TARGET_FILE, jsonData, { flag: 'w' });
