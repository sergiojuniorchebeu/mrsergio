import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BrowserWindowProps extends HTMLAttributes<HTMLDivElement> {
    src: string;
    alt?: string;
    urlLabel?: string;
}

export function BrowserWindow({
    src,
    alt = "",
    urlLabel = "https://product.demo",
    className,
    ...props
}: BrowserWindowProps) {
    return (
        <div
            className={cn(
                "overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]",
                className
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>

                <div className="mx-4 flex h-9 flex-1 items-center rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-400">
                    {urlLabel}
                </div>
            </div>

            <div className="aspect-[16/10] bg-slate-100">
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top"
                />
            </div>
        </div>
    );
}