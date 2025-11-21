export const columns = [
  {
    name: "Role Name",
    selector: (row) => row.role,
  },
  {
    name: "Description",
    selector: (row) => row.roleDescription,
  },
  {
    name: "Status",
    selector: (row) => row.roleStatus,
  },
  {
    name: "Action",
    selector: (row) => row.action,
  },
];
