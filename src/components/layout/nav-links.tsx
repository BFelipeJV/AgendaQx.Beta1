
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem, IconName } from '@/lib/types';
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
} from "@/components/ui/tooltip"; // Corrected import path
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as LucideIcons from 'lucide-react';
import { ChevronDown } from 'lucide-react';

const getIconComponent = (iconName?: IconName): React.ComponentType<{ className?: string }> | null => {
  if (!iconName) return null;
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
  if (typeof IconComponent === 'function' || (IconComponent && typeof (IconComponent as any).$$typeof === 'symbol' && (IconComponent as any).$$typeof.toString().includes('react.'))) {
    return IconComponent;
  }
  return null;
};

interface NavLinksProps {
  navItems: NavItem[];
  isMobile?: boolean;
}

export default function NavLinks({ navItems, isMobile = false }: NavLinksProps) {
  const pathname = usePathname();

  const renderNavItem = (item: NavItem, isSubItem = false) => {
    const IconComponent = getIconComponent(item.iconName);
    let isActive = item.href ? (pathname === item.href || (item.href !== '/dashboard' && item.href !== '/' && pathname.startsWith(item.href))) : false;

    if (item.subItems && item.subItems.length > 0) {
      isActive = isActive || item.subItems.some(subItem => subItem.href && (pathname === subItem.href || (subItem.href !== '/dashboard' && subItem.href !== '/' && pathname.startsWith(subItem.href))));
    }

    const tooltipContentProps: React.ComponentProps<typeof TooltipContent> | undefined = item.description ? {children: item.description, side: 'right', align: 'center'} : undefined;

    if (!item.href && !item.subItems) { // Item is purely a label or non-interactive
      return (
        <div className={cn(
          "w-full flex items-center gap-2 p-2 text-left text-sm text-sidebar-foreground/70",
          isSubItem && "pl-8 pr-2 py-1.5 h-auto",
        )}>
          {IconComponent && <IconComponent className={cn("h-5 w-5", isSubItem && "h-4 w-4")} />}
          <span className={cn("truncate", isSubItem && "text-sm font-normal")}>{item.title}</span>
        </div>
      );
    }
    
    if (!item.href && item.subItems && item.subItems.length > 0) {
        return null; 
    }

    if (!item.href) return null; // Ensure href exists for Link

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
          tooltip={!isSubItem && !isMobile && !item.subItems ? tooltipContentProps : undefined}
          aria-label={item.title}
        >
          {IconComponent && <IconComponent className={cn("h-5 w-5", isSubItem && "h-4 w-4")} />}
          <span className={cn(
            "truncate",
            isSubItem && "text-sm font-normal"
          )}>
            {item.title}
          </span>
          {item.label && !isSubItem && (
            <span className="ml-auto text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
              {item.label}
            </span>
          )}
        </SidebarMenuButton>
      </Link>
    );
  };

  const defaultOpenAccordionItems = navItems.reduce((acc: string[], item, index) => {
    if (item.subItems && item.subItems.some(subItem => subItem.href && (pathname === subItem.href || (subItem.href !== '/dashboard' && subItem.href !== '/' && pathname.startsWith(subItem.href))))) {
      acc.push(`accordion-item-${index}`);
    }
    return acc;
  }, []);


  if (isMobile) {
    const mobileNavLinks: JSX.Element[] = [];
    navItems.forEach((item, idx) => {
      if (item.href && !item.subItems) {
        const renderedItem = renderNavItem(item, false);
        if (renderedItem) {
          mobileNavLinks.push(
            <SidebarMenuItem key={item.href || `${item.title}-${idx}-main`}>
              {renderedItem}
            </SidebarMenuItem>
          );
        }
      }
      if (item.subItems) {
        item.subItems.forEach((subItem, subIdx) => {
          if (subItem.href) {
            const renderedSubItem = renderNavItem(subItem, true);
            if (renderedSubItem) {
              mobileNavLinks.push(
                <SidebarMenuItem key={subItem.href || `${subItem.title}-${idx}-${subIdx}`}>
                  {renderedSubItem}
                </SidebarMenuItem>
              );
            }
          }
        });
      }
    });

    return (
      <SidebarMenu className="p-4">
        {mobileNavLinks}
      </SidebarMenu>
    );
  }

  return (
    <TooltipProvider>
      <Accordion type="multiple" defaultValue={defaultOpenAccordionItems} className="w-full space-y-0.5 p-2">
        {navItems.map((item, index) => {
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
              <AccordionItem value={`accordion-item-${index}`} key={item.title} className="border-b-0">
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
                              {/* The ChevronDown is automatically added by AccordionTrigger, so no need to add it manually here */}
                          </div>
                      </TooltipTrigger>
                      {parentTooltipContentProps && <TooltipContent {...parentTooltipContentProps} className="group-data-[collapsible=icon]:block hidden" />}
                  </Tooltip>
                </AccordionTrigger>
                <AccordionContent className="pb-1 pt-1 group-data-[collapsible=icon]:hidden">
                  <SidebarMenu className="ml-[calc(0.5rem_+_1px)] border-l border-sidebar-border pl-3.5 py-1 space-y-0.5">
                    {item.subItems.map((subItem) => {
                      if (!subItem.href) return null; 
                      const renderedSubItem = renderNavItem(subItem, true);
                      if (renderedSubItem) {
                        return (
                          <SidebarMenuItem key={subItem.href || subItem.title}>
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
            if (!item.href) return null; 
            const renderedItem = renderNavItem(item);
            if (renderedItem) {
                return (
                  <SidebarMenuItem key={item.href} className="rounded-md">
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
