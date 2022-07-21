export const badges = [
  {
    id: 1,
    name: "Team Player",
    imageFilePath: "images/badges/team-player.png",
  },
  {
    id: 2,
    name: "Karaoke Star",
    imageFilePath: "images/badges/karaoke.png",
  },
  {
    id: 3,
    name: "Fashionista",
    imageFilePath: "images/badges/fashionista.png",
  },
  {
    id: 4,
    name: "Nice Kicks",
    imageFilePath: "images/badges/nice-kicks.png",
  },
  {
    id: 5,
    name: "Helping Hand",
    imageFilePath: "images/badges/helping-hand.png",
  },
  {
    id: 6,
    name: "Comic Relief",
    imageFilePath: "images/badges/comic-relief.png",
  },
];

export const employeesWithoutBadgeDetails = [
  {
    id: 41,
    firstName: "Angélica",
    lastName: "Bustos",
    imageFilePath: "images/employees/f-26.png",
    teamName: "Marketing",
    jobTitle: "VP Marketing",
    badgeIds: [2, 3],
  },
  {
    id: 151,
    firstName: "Ann",
    lastName: "Hampton",
    imageFilePath: "images/employees/n-15.png",
    teamName: "Engineering",
    jobTitle: "Web Developer",
    badgeIds: [],
  },
  {
    id: 159,
    firstName: "Dianne",
    lastName: "Haley",
    imageFilePath: "images/employees/n-4.png",
    teamName: "Accounting",
    jobTitle: "VP Accounting",
    badgeIds: [1, 3, 4, 5],
  },
  {
    id: 69,
    firstName: "Hannah",
    lastName: "McPherson",
    imageFilePath: "images/employees/f-8.png",
    teamName: "Engineering",
    jobTitle: "Web Designer",
    badgeIds: [6],
  },
  {
    id: 50,
    firstName: "Hilaria",
    lastName: "Aquino",
    imageFilePath: "images/employees/f-4.png",
    teamName: "Engineering",
    jobTitle: "Software Engineer",
    badgeIds: [4, 6, 1, 3, 2],
  },
  {
    id: 105,
    firstName: "Shannon",
    lastName: "Mathis",
    imageFilePath: "images/employees/f-20.png",
    teamName: "Engineering",
    jobTitle: "Senior Quality Engineer",
    badgeIds: [1, 2, 3, 5, 6],
  },
  {
    id: 49,
    firstName: "Ventura",
    lastName: "Canning",
    imageFilePath: "images/employees/n-13.png",
    teamName: "People",
    jobTitle: "Employee Relations",
    badgeIds: [],
  },
  {
    id: 22,
    firstName: "Xinming",
    lastName: "Tsui",
    imageFilePath: "images/employees/m-8.png",
    teamName: "Customer Success",
    jobTitle: "Account Coordinator",
    badgeIds: [6, 2],
  },
  {
    id: 1,
    firstName: "Yuki",
    lastName: "Shiroki",
    imageFilePath: "images/employees/n-2.png",
    teamName: "Engineering",
    jobTitle: "Product Manager",
    badgeIds: [1, 4, 3],
  },
  {
    id: 42,
    firstName: "Felisa",
    lastName: "Dominguez",
    imageFilePath: "images/employees/f-9.png",
    teamName: "Engineering",
    jobTitle: "Analyst Programmer",
    badgeIds: [2, 5],
  },
];

export const employeesWithBadgeDetails = employeesWithoutBadgeDetails.map(
  (employee) => {
    const badgeDetails = employee.badgeIds.map((id) => badges[id - 1]);
    return { ...employee, badgeDetails };
  }
);
