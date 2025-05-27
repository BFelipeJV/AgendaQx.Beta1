import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarFooter } from "@/components/ui/sidebar";
import AppHeader from "@/components/layout/app-header";
import NavLinks from "@/components/layout/nav-links";
import { NAV_ITEMS_MAIN, NAV_ITEMS_AUTH } from "@/lib/constants";
import { LogoIcon } from "@/components/icons/logo";
import Link from "next/link";
import { APP_HEADER_TITLE } from "@/lib/constants";

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="flex items-center justify-center p-4 border-b group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <LogoIcon className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold group-data-[collapsible=icon]:hidden">{APP_HEADER_TITLE}</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <NavLinks navItems={NAV_ITEMS_MAIN} />
        </SidebarContent>
        <SidebarFooter className="p-0 border-t mt-auto">
           <NavLinks navItems={NAV_ITEMS_AUTH} />
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col flex-1">
        <AppHeader />
        <SidebarInset> {/* This provides the main content area with appropriate margins from sidebar */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
