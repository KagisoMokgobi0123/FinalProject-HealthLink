export const columns = [
  {
    name: " Bed Code",
    selector: (row) => row.bed_codeName,
  },
  {
    name: " Type",
    selector: (row) => row.bed_Type,
  },
  {
    name: " Ward",
    selector: (row) => row.ward,
  },
  {
    name: " Status",
    selector: (row) => row.bed_Status,
  },
  {
    name: " Action",
    selector: (row) => row.action,
  },
];
