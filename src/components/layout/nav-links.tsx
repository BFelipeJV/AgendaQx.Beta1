'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem, IconName } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  TooltipContent
} from '@/components/ui/sidebar';
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons

// Helper to get icon component by name
const getIconComponent = (iconName?: IconName): React.ComponentType<{ className?: string }> | null => {
  if (!iconName) return null;
  // Check if the iconName is a valid key in LucideIcons and corresponds to a component
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
  // Ensure it's a function (React component constructor/function) or a forwardRef object
  if (typeof IconComponent === 'function' || (IconComponent && typeof (IconComponent as any).$$typeof === 'symbol' && (IconComponent as any).$$typeof.toString() === 'Symbol(react.forward_ref)')) {
    return IconComponent;
  }
  return null; 
};

interface NavLinksProps {
  navItems: NavItem[];
  isMobile?: boolean; // To adjust layout or behavior for mobile if needed
}

export default function NavLinks({ navItems, isMobile = false }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <SidebarMenu className={cn(isMobile ? "p-4" : "p-2")}>
      {navItems.map((item) => {
        const IconComponent = getIconComponent(item.iconName);
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
