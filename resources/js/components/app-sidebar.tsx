import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, CircleDollarSign, CircleUser, ClipboardPen, Folder, Handshake, HeartPulse, LayoutGrid, User, User2, Warehouse } from 'lucide-react';
import AppLogo from './app-logo';
import { route } from 'ziggy-js';
import { usePage } from '@inertiajs/react';

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type PageProps = {
    auth: {
        user: AuthUser;
    };
};

/*
const mainNavItems: NavItem[] = [
     {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Admin',
        href: route('admin.index'),
        icon: User2,
    },
     {
        title: 'Doctors',
        href: '/doctors',
        icon: HeartPulse,
    },
     {
        title: 'Patients',
        href: '/patients',
        icon: CircleUser,
    },
     {
        title: 'Receptionist',
        href: '/receptionist',
        icon: Handshake,
    },
     {
        title: 'Insurances',
        href: '/insurance',
        icon: Warehouse,
    },
     {
        title: 'Billing',
        href: '/billing',
        icon: CircleDollarSign,
    },
    {
        title: 'Appointments',
        href: '/appointments',
        icon: ClipboardPen,
    },

];*/

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
        const { props } = usePage<PageProps>();
    const role = props.auth.user.role;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },

        ...(role === 'admin'
            ? [
                  {
                      title: 'Admin',
                      href: route('admin.index'),
                      icon: User2,
                  },
              ]
            : []),

        ...((role === 'admin' || role === 'receptionist')
            ? [
                  {
                      title: 'Doctors',
                      href: '/doctors',
                      icon: HeartPulse,
                  },
                  {
                      title: 'Patients',
                      href: '/patients',
                      icon: CircleUser,
                  },
                  {
                      title: 'Appointments',
                      href: '/appointments',
                      icon: ClipboardPen,
                  },
              ]
            : []),

        ...(role === 'admin'
            ? [
                  {
                      title: 'Receptionist',
                      href: '/receptionist',
                      icon: Handshake,
                  },
                  {
                      title: 'Insurances',
                      href: '/insurance',
                      icon: Warehouse,
                  },
              ]
            : []),

        ...((role === 'admin' || role === 'billing')
            ? [
                  {
                      title: 'Billing',
                      href: '/billing',
                      icon: CircleDollarSign,
                  },
              ]
            : []),
    ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
