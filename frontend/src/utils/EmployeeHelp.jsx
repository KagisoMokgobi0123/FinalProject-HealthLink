import { Link } from "react-router-dom";

export const columns = (handleEdit, handleDelete) => [
  {
    name: "First Name",
    selector: (row) => row.firstName,
    sortable: true,
  },
  {
    name: "Last Name",
    selector: (row) => row.lastName,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Cell Number",
    selector: (row) => row.cellNo,
  },
  {
    name: "Address",
    selector: (row) => row.address,
  },
  {
    name: "Role",
    selector: (row) => row.roleName, // assume backend populates roleName
  },
  {
    name: "Action",
    cell: (row) => (
      <div className="flex gap-2">
        <Link
          to={`/admin-dashboard/edit-employee/${row._id}`}
          className="px-2 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition"
        >
          Edit
        </Link>
        <button
          onClick={() => handleDelete(row._id)}
          className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    ),
    ignoreRowClick: true,
  },
];
