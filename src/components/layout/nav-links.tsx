'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  TooltipContent
} from '@/components/ui/sidebar';


interface NavLinksProps {
  navItems: NavItem[];
  isMobile?: boolean; // To adjust layout or behavior for mobile if needed
}

export default function NavLinks({ navItems, isMobile = false }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <SidebarMenu className={cn(isMobile ? "p-4" : "p-2")}>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        
        const tooltipContent: React.ComponentProps<typeof TooltipContent> | undefined = item.description ? {children: item.description, side: 'right', align: 'center'} : undefined;

        return (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
              <SidebarMenuButton
                asChild={false} // Ensure it renders as a button for proper styling and interaction with Sidebar component
                isActive={isActive}
                disabled={item.disabled}
                className="w-full"
                tooltip={tooltipContent}
                aria-label={item.title}
              >
                {IconComponent && <IconComponent className="h-5 w-5" />}
                <span className={cn(
                  "truncate",
                  // Hide text when sidebar is collapsed (handled by Sidebar component CSS)
                  // "group-data-[collapsible=icon]:hidden" 
                )}>
                  {item.title}
                </span>
                {item.label && (
                  <span className="ml-auto text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                )}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
