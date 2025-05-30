
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem, IconName, StoredUser } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; 
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as LucideIcons from 'lucide-react';
import { useState, useEffect } from 'react';
import { CURRENT_USER_SESSION_KEY } from '@/lib/constants';


const getIconComponent = (iconName?: IconName): React.ComponentType<{ className?: string }> | null => {
  if (!iconName) return null;
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
  if (typeof IconComponent === 'function' || (IconComponent && typeof (IconComponent as any).$$typeof === 'symbol' && (IconComponent as any).$$typeof.toString().includes('react.'))) {
    return IconComponent;
  }
  console.warn(`Icon "${iconName}" not found in lucide-react.`);
  return null;
};

interface NavLinksProps {
  navItems: NavItem[];
  isMobile?: boolean;
  onItemClick?: () => void; // For mobile to close sheet
  onLogoutClick?: () => void; // Specific handler for logout on mobile
}

export default function NavLinks({ navItems: initialNavItems, isMobile = false, onItemClick, onLogoutClick }: NavLinksProps) {
  const pathname = usePathname();
  const [currentUserRole, setCurrentUserRole] = useState<StoredUser['rol'] | null>(null);
  const [processedNavItems, setProcessedNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    try {
      const userSessionJson = localStorage.getItem(CURRENT_USER_SESSION_KEY);
      if (userSessionJson) {
        const currentUser: StoredUser = JSON.parse(userSessionJson);
        setCurrentUserRole(currentUser.rol);
      } else {
        setCurrentUserRole(null); 
      }
    } catch (error) {
      console.error("Error loading user session from localStorage in NavLinks:", error);
      setCurrentUserRole(null);
    }
  }, [pathname]); 

  useEffect(() => {
    const filterItems = (items: NavItem[]): NavItem[] => {
      return items.filter(item => {
        if (item.adminOnly && currentUserRole !== 'administrador') {
          return false;
        }
        if (item.subItems) {
          item.subItems = filterItems(item.subItems); 
        }
        return true;
      }).map(item => ({ ...item, subItems: item.subItems?.length ? item.subItems : undefined })); // Ensure subItems is undefined if empty after filtering
    };
    setProcessedNavItems(filterItems(JSON.parse(JSON.stringify(initialNavItems)))); 

  }, [currentUserRole, initialNavItems]);


  const renderNavItem = (item: NavItem, isSubItem = false, isMobileLink = false) => {
    const IconComponent = getIconComponent(item.iconName);
    let isActive = false;
    if (item.href) {
     isActive = item.href ? (pathname === item.href || (item.href !== '/dashboard' && item.href !== '/' && pathname.startsWith(item.href))) : false;
    }

    if (item.subItems && item.subItems.length > 0) {
      isActive = isActive || item.subItems.some(subItem => subItem.href && (pathname === subItem.href || (subItem.href !== '/dashboard' && subItem.href !== '/' && pathname.startsWith(subItem.href))));
    }
    
    const tooltipContentProps: React.ComponentProps<typeof TooltipContent> | undefined = item.description ? {children: item.description, side: 'right', align: 'center'} : undefined;

    const buttonContent = (
      <>
        {IconComponent && <IconComponent className={cn("h-5 w-5", isSubItem && "h-4 w-4")} />}
        <span className={cn("truncate", isSubItem && "text-sm font-normal")}>{item.title}</span>
        {item.label && !isSubItem && !isMobileLink && (
          <span className="ml-auto text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            {item.label}
          </span>
        )}
      </>
    );

    const handleLinkClick = () => {
      // Special handling for logout on mobile
      if (isMobileLink && item.title === 'Cerrar Sesión' && onLogoutClick) {
        onLogoutClick();
      }
      if (isMobileLink && onItemClick) {
        onItemClick(); 
      }
    };
    
    // If it's the mobile logout button and onLogoutClick is provided, handle it directly
    if (isMobileLink && item.title === 'Cerrar Sesión' && onLogoutClick) {
      return (
        <SidebarMenuButton
          onClick={handleLinkClick}
          isActive={isActive}
          disabled={item.disabled}
          className={cn(
            "w-full",
            isSubItem && "pl-8 pr-2 py-1.5 h-auto text-sm",
            isSubItem && "group-data-[collapsible=icon]:pl-2 group-data-[collapsible=icon]:pr-2"
          )}
          aria-label={item.title}
        >
          {buttonContent}
        </SidebarMenuButton>
      );
    }


    if (!item.href) return null; 

    return (
      <Link href={item.href} legacyBehavior passHref>
        <SidebarMenuButton
          asChild={false} 
          isActive={isActive}
          disabled={item.disabled}
          className={cn(
            "w-full",
            isSubItem && "pl-8 pr-2 py-1.5 h-auto text-sm",
            isSubItem && "group-data-[collapsible=icon]:pl-2 group-data-[collapsible=icon]:pr-2"
          )}
          tooltip={!isSubItem && !isMobileLink && !item.subItems ? tooltipContentProps : undefined}
          aria-label={item.title}
          onClick={handleLinkClick}
        >
          {buttonContent}
        </SidebarMenuButton>
      </Link>
    );
  };
  
  const defaultOpenAccordionItems = processedNavItems.reduce((acc: string[], item, index) => {
    if (item.subItems && item.subItems.some(subItem => subItem.href && (pathname === subItem.href || (subItem.href !== '/dashboard' && subItem.href !== '/' && pathname.startsWith(subItem.href))))) {
      acc.push(`accordion-item-${index}`);
    }
    return acc;
  }, []);

  if (isMobile) {
    const mobileNavLinks: JSX.Element[] = [];
    processedNavItems.forEach((item, idx) => {
      if (item.title === 'Cerrar Sesión' && onLogoutClick) {
         const renderedItem = renderNavItem(item, false, true);
         if (renderedItem) {
            mobileNavLinks.push(
                <SidebarMenuItem key={`${item.title}-${idx}-main-mobile`}>
                {renderedItem}
                </SidebarMenuItem>
            );
         }
      } else if (item.href) {
        const renderedItem = renderNavItem(item, false, true);
        if (renderedItem) {
          mobileNavLinks.push(
            <SidebarMenuItem key={item.href || `${item.title}-${idx}-main-mobile`}>
              {renderedItem}
            </SidebarMenuItem>
          );
        }
      } else if (item.subItems && item.subItems.length > 0) {
        const ParentIconComponent = getIconComponent(item.iconName);
        mobileNavLinks.push(
          <div key={`${item.title}-${idx}-parent-label`} className="px-2 py-2 text-sm font-semibold text-sidebar-foreground/70 flex items-center gap-2">
            {ParentIconComponent && <ParentIconComponent className="h-5 w-5" />}
            {item.title}
          </div>
        );
      }

      if (item.subItems) {
        item.subItems.forEach((subItem, subIdx) => {
          const renderedSubItem = renderNavItem(subItem, true, true);
          if (renderedSubItem) {
            mobileNavLinks.push(
              <SidebarMenuItem key={subItem.href || `${subItem.title}-${idx}-${subIdx}-mobile`} className="pl-4">
                {renderedSubItem}
              </SidebarMenuItem>
            );
          }
        });
      }
    });

    return (
      <SidebarMenu className="p-4 space-y-1">
        {mobileNavLinks}
      </SidebarMenu>
    );
  }


  return (
    <TooltipProvider>
      <Accordion type="multiple" defaultValue={defaultOpenAccordionItems} className="w-full space-y-0.5 p-2">
        {processedNavItems.map((item, index) => {
          const ParentIconComponent = getIconComponent(item.iconName);
          let isParentActive = false;
          if (item.subItems && item.subItems.length > 0) {
            isParentActive = item.subItems.some(subItem => subItem.href && (pathname === subItem.href || (subItem.href !== '/dashboard' && subItem.href !== '/' && pathname.startsWith(subItem.href))));
          } else if (item.href) {
            isParentActive = (pathname === item.href || (item.href !== '/dashboard' && item.href !== '/' && pathname.startsWith(item.href)));
          }

          const parentTooltipContentProps: React.ComponentProps<typeof TooltipContent> | undefined = item.description ? {children: item.description, side: 'right', align: 'center'} : undefined;

          if (item.subItems && item.subItems.length > 0) {
            return (
              <AccordionItem value={`accordion-item-${index}`} key={`${item.title}-${index}-desktop`} className="border-b-0">
                <AccordionTrigger
                  className={cn(
                    "py-0 px-0 hover:no-underline rounded-md group",
                    "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
                    isParentActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <div className={cn( 
                              "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none",
                              "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-2"
                          )}>
                              {ParentIconComponent && <ParentIconComponent className="h-5 w-5 shrink-0" />}
                              <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                              {item.label && <span className="ml-auto text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">{item.label}</span>}
                          </div>
                      </TooltipTrigger>
                      {parentTooltipContentProps && <TooltipContent {...parentTooltipContentProps} className="group-data-[collapsible=icon]:block hidden" />}
                  </Tooltip>
                </AccordionTrigger>
                <AccordionContent className="pb-1 pt-1 group-data-[collapsible=icon]:hidden">
                  <SidebarMenu className="ml-[calc(0.5rem_+_1px)] border-l border-sidebar-border pl-3.5 py-1 space-y-0.5">
                    {item.subItems.map((subItem) => {
                      const renderedSubItem = renderNavItem(subItem, true, false);
                      if (renderedSubItem) {
                        return (
                          <SidebarMenuItem key={subItem.href || `${subItem.title}-sub-desktop`}>
                            {renderedSubItem}
                          </SidebarMenuItem>
                        );
                      }
                      return null;
                    })}
                  </SidebarMenu>
                </AccordionContent>
              </AccordionItem>
            );
          } else { 
            const renderedItem = renderNavItem(item, false, false);
            if (renderedItem) {
                return (
                  <SidebarMenuItem key={item.href || `${item.title}-direct-desktop`} className="rounded-md">
                    {renderedItem}
                  </SidebarMenuItem>
                );
            }
            return null;
          }
        })}
      </Accordion>
    </TooltipProvider>
  );
}
