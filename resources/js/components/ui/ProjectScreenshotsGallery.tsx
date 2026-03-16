import { Iphone } from "@/components/ui/iphone";
import { BrowserWindow } from "@/components/ui/BrowserWindow";
import { DesktopWindow } from "@/components/ui/DesktopWindow";

type ProjectType = "web" | "mobile" | "desktop" | "api";

interface Props {
    projectType: ProjectType;
    screenshots: string[];
    title: string;
    demoUrl?: string | null;
}

export function ProjectScreenshotsGallery({
    projectType,
    screenshots,
    title,
    demoUrl,
}: Props) {
    if (!screenshots?.length) return null;

    if (projectType === "mobile") {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {screenshots.map((src, i) => (
                    <div key={src + i} className="mx-auto w-full max-w-[260px]">
                        <Iphone src={src} aria-label={`${title} screenshot ${i + 1}`} />
                    </div>
                ))}
            </div>
        );
    }

    if (projectType === "desktop") {
        return (
            <div className="space-y-8">
                {screenshots.map((src, i) => (
                    <DesktopWindow
                        key={src + i}
                        src={src}
                        alt={`${title} screenshot ${i + 1}`}
                        title={title}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {screenshots.map((src, i) => (
                <BrowserWindow
                    key={src + i}
                    src={src}
                    alt={`${title} screenshot ${i + 1}`}
                    urlLabel={demoUrl || "https://product.demo"}
                />
            ))}
        </div>
    );
}