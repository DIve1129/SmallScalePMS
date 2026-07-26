import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

/* Displays the main sidebar navigation items and highlights the currently active page. */
export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-0">
            {/* Displays the heading for the primary application navigation section. */}
            <SidebarGroupLabel
                className="
                    px-3 pb-2
                    text-xs font-semibold tracking-wide
                    text-slate-500 uppercase
                    dark:text-sidebar-foreground/60
                "
            >
                Platform
            </SidebarGroupLabel>

            {/* Displays all navigation links passed to the component. */}
            <SidebarMenu className="space-y-1">
                {items.map((item) => {
                    const isActive = page.url.startsWith(item.href);

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className="
                                    h-10 rounded-lg px-3
                                    text-slate-700
                                    transition-colors
                                    hover:bg-[#DDEEFF]
                                    hover:text-[#1D4ED8]
                                    data-[active=true]:bg-[#CFE8FF]
                                    data-[active=true]:font-semibold
                                    data-[active=true]:text-[#1D4ED8]
                                    [&_svg]:text-[#2563EB]
                                    data-[active=true]:[&_svg]:text-[#1D4ED8]

                                    dark:text-sidebar-foreground
                                    dark:hover:bg-sidebar-accent
                                    dark:hover:text-sidebar-accent-foreground
                                    dark:data-[active=true]:bg-sidebar-accent
                                    dark:data-[active=true]:text-sidebar-accent-foreground
                                    dark:[&_svg]:text-sidebar-foreground
                                    dark:data-[active=true]:[&_svg]:text-sidebar-accent-foreground
                                "
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && (
                                        <item.icon className="h-5 w-5" />
                                    )}

                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}