import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex items-center gap-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black">
    <AppLogoIcon className="h-5 w-5 text-white" />
    </div>
    <span className="truncate leading-tight font-semibold">
    Hospital Management System
    </span>
    </div>
</>
    );
}
