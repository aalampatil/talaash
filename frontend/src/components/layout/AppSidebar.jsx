"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar.jsx";
import Link from "next/link";
import { UseUserContext } from "@/features/auth/context/UserContext.jsx";

export default function AppSidebar({ role }) {
  const { becomeLandlord, logoutUser } = UseUserContext();

  function handleClick() {
    logoutUser();
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {role === "tenant" && (
                <>
                  <SidebarMenuItem>
                    <Link href="/account">Account</Link>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <Link href="/saved-properties">Saved Property</Link>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <Link href="/my-visits">Visits</Link>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <button onClick={becomeLandlord}>Become a Host</button>
                  </SidebarMenuItem>
                </>
              )}

              {role === "landlord" && (
                <>
                  <SidebarMenuItem>
                    <Link href="/dashboard/landlord/properties">Properties</Link>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <Link href="/dashboard/landlord/visits">Visits</Link>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <Link href="/dashboard/landlord/add-new-property">Add New Properties</Link>
                  </SidebarMenuItem>
                </>
              )}

              {role === "admin" && (
                <>
                  <SidebarMenuItem>
                    <Link href="/dashboard/admin">Admin Dashboard</Link>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <Link href="/dashboard/admin/all-users">All Users</Link>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <Link href="/dashboard/admin/all-landlords">All Landlords</Link>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <Link href="/dashboard/admin/all-properties">All Properties</Link>
                  </SidebarMenuItem>
                </>
              )}

              <SidebarMenuItem>
                <button onClick={handleClick}>Logout</button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
