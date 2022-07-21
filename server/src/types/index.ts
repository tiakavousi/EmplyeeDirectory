export type Badge = {
  id: number;
  name: string;
  imageFilePath: string;
};

export type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  teamName: string;
  jobTitle: string;
  imageFilePath: string;
  badgeIds: Array<number>;
};

export type EmployeeWithBadgeDetails = Employee & {
  badgeDetails: Array<Badge>;
};
