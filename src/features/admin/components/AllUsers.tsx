"use client";
import PeopleTable from "@/features/admin/components/PeopleTable";
import { UseAdminContext } from "@/features/admin/context/AdminContext";
export default function AllUsers() { const { allUsers } = UseAdminContext(); return <PeopleTable people={allUsers} />; }
