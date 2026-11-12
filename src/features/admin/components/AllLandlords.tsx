"use client";
import PeopleTable from "@/features/admin/components/PeopleTable";
import { UseAdminContext } from "@/features/admin/context/AdminContext";
export default function AllLandlords() { const { allLandlords } = UseAdminContext(); return <PeopleTable people={allLandlords} landlords />; }
