import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface DesktopWindowProps extends HTMLAttributes<HTMLDivElement> {
    src: string;
    alt?: string;
    title?: string;
}

export function DesktopWindow({
    src,
    alt = "",
    title = "Desktop App",
    className,
    ...props
}: DesktopWindowProps) {
    return (
        <div className={cn("mx-auto w-full max-w-5xl", className)} {...props}>
            <div className="overflow-hidden rounded-[24px] border border-slate-300 bg-[#111827] shadow-[0_20px_80px_rgba(15,23,42,0.18)]">
                <div className="flex items-center justify-between border-b border-white/10 bg-[#1f2937] px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-400" />
                        <span className="h-3 w-3 rounded-full bg-amber-400" />
                        <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    </div>

                    <div className="text-xs font-medium text-white/50">{title}</div>
                </div>

                <div className="aspect-[16/10] bg-black">
                    <img
                        src={src}
                        alt={alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top"
                    />
                </div>
            </div>

            <div className="mx-auto h-4 w-[38%] rounded-b-2xl bg-slate-300" />
            <div className="mx-auto mt-1 h-2 w-[18%] rounded-full bg-slate-200" />
        </div>
    );
}