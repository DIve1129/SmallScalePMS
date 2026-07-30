import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CircleDollarSign,
    CircleUser,
    ClipboardPen,
    Folder,
    HeartPulse,
    LayoutGrid,
    User2,
    Warehouse,
} from 'lucide-react';
import { route } from 'ziggy-js';
import AppLogo from './app-logo';

/* Defines the authenticated user information available through the Inertia page properties. */
type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: string;
};

/* Defines the authentication information passed to this component by Laravel and Inertia. */
type PageProps = {
    auth: {
        user: AuthUser;
    };
};

/* Stores optional external navigation links that can be displayed in the sidebar footer. */
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

/* Displays the main application sidebar with navigation options based on the authenticated user's role. */
export function AppSidebar() {
    const { props } = usePage<PageProps>();
    const role = props.auth.user.role;

    /* Builds the sidebar navigation menu according to the permissions assigned to each user role. */
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
                  {
                      title: 'Doctors',
                      href: '/doctors',
                      icon: HeartPulse,
                  },
              ]
            : []),

        ...(role === 'admin' || role === 'receptionist' || role === 'billing'
            ? [
                  {
                      title: 'Patients',
                      href: '/patients',
                      icon: CircleUser,
                  },
              ]
            : []),

        ...(role === 'admin' || role === 'receptionist'
            ? [
                  {
                      title: 'Insurances',
                      href: '/insurance',
                      icon: Warehouse,
                  },
              ]
            : []),

        ...(role === 'admin' || role === 'receptionist'
            ? [
                  {
                      title: 'Appointments',
                      href: '/appointments',
                      icon: ClipboardPen,
                  },
              ]
            : []),

        ...(role === 'admin' || role === 'billing' || role === 'doctor'
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
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="
                border-r border-blue-100
                bg-[#EAF5FF]
                text-slate-700
                dark:border-sidebar-border
                dark:bg-sidebar
                dark:text-sidebar-foreground
                [&_[data-sidebar=sidebar]]:bg-[#EAF5FF]
                dark:[&_[data-sidebar=sidebar]]:bg-sidebar
            "
        >
            {/* Displays the application logo at the top of the sidebar. */}
            <SidebarHeader
                className="
                    border-b border-blue-100
                    bg-[#EAF5FF]
                    px-2 py-3
                    dark:border-sidebar-border
                    dark:bg-sidebar
                "
            >
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="
                                rounded-lg
                                text-slate-800
                                transition-colors
                                hover:bg-[#CFE8FF]
                                hover:text-[#1D4ED8]
                                dark:text-sidebar-foreground
                                dark:hover:bg-sidebar-accent
                                dark:hover:text-sidebar-accent-foreground
                            "
                        >
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Displays the role-based main navigation menu. */}
            <SidebarContent
                className="
                    bg-[#EAF5FF]
                    px-2 py-3
                    dark:bg-sidebar
                "
            >
                <NavMain items={mainNavItems} />
            </SidebarContent>

            {/* Displays the authenticated user's profile and account controls. */}
            <SidebarFooter
                className="
                    border-t border-blue-100
                    bg-[#EAF5FF]
                    p-2
                    dark:border-sidebar-border
                    dark:bg-sidebar
                "
            >
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}