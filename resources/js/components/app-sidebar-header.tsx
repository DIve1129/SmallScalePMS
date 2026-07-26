import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

/* Displays the application header with the sidebar toggle and page breadcrumbs. */
export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header
            className="
                flex h-16 shrink-0 items-center gap-2
                border-b border-blue-100
                bg-white
                px-6 shadow-sm
                transition-[width,height] ease-linear
                group-has-data-[collapsible=icon]/sidebar-wrapper:h-12
                md:px-4
                dark:border-border
                dark:bg-background
            "
        >
            {/* Contains the sidebar toggle button and current page breadcrumb navigation. */}
            <div className="flex items-center gap-3">
                <SidebarTrigger
                    className="
                        -ml-1 rounded-lg
                        text-[#2563EB]
                        transition-colors
                        hover:bg-[#EAF5FF]
                        hover:text-[#1D4ED8]
                        dark:text-foreground
                        dark:hover:bg-accent
                        dark:hover:text-accent-foreground
                    "
                />

                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}