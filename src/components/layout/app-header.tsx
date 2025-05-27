import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UserCircle } from 'lucide-react';
import { LogoIcon } from '@/components/icons/logo';
import { APP_HEADER_TITLE, NAV_ITEMS_MAIN, NAV_ITEMS_AUTH } from '@/lib/constants';
import NavLinks from '@/components/layout/nav-links';
import { SidebarTrigger } from '@/components/ui/sidebar';


export default function AppHeader() {
  // Placeholder user data
  const userName = "Dr. Ejemplo"; // Can be localized or fetched
  const userInitials = userName.split(" ").map(n => n[0]).join("").substring(0,2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2 md:hidden">
         <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Alternar menú de navegación</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <div className="flex h-16 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
                  <LogoIcon className="h-6 w-6 text-primary" />
                  <span>{APP_HEADER_TITLE}</span>
                </Link>
              </div>
              <nav className="flex-1 overflow-auto py-4">
                <NavLinks navItems={[...NAV_ITEMS_MAIN, ...NAV_ITEMS_AUTH]} isMobile={true} />
              </nav>
            </SheetContent>
          </Sheet>
      </div>
      
      <div className="hidden md:flex items-center gap-2">
        <SidebarTrigger className="text-foreground hover:text-primary"/>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg text-foreground hover:text-primary">
          <LogoIcon className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">{APP_HEADER_TITLE}</span>
        </Link>
      </div>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/40x40.png" alt={userName} data-ai-hint="user avatar" />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Alternar menú de usuario</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi Cuenta ({userName})</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configuración</DropdownMenuItem>
            <DropdownMenuItem>Soporte</DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/login">
              <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
