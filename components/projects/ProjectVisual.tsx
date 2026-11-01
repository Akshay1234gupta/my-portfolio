import Image from "next/image";
import type { Project } from "@/lib/types";

/** Browser chrome around a project visual. Uses a real screenshot when provided, otherwise a drawn UI. */
export function BrowserMockup({ project }: { project: Project }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/12 bg-[#090b10]/95 shadow-[0_35px_90px_-20px_rgba(0,0,0,0.9),0_0_40px_-10px_rgba(34,211,238,0.12)] ring-1 ring-white/5 backdrop-blur-xl transition-all duration-300 hover:border-cyan/40 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.95),0_0_50px_-5px_rgba(34,211,238,0.25)]">
      <div className="flex items-center gap-3 border-b border-white/8 bg-white/[0.02] px-4 py-3" aria-hidden>
        <span className="flex gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80 shadow-sm" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80 shadow-sm" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80 shadow-sm" />
        </span>
        <span className="mx-auto flex h-6 w-3/5 max-w-xs items-center justify-center gap-2 rounded-full border border-white/8 bg-black/40 px-3 font-mono text-[0.68rem] text-muted/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
          <span>akshay.dev/{project.id}</span>
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#06080d]">
        {project.screenshot ? (
          <Image
            src={project.screenshot}
            alt={`Screenshot of ${project.name}`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div role="img" aria-label={`Illustrated interface preview of ${project.name}`} className="absolute inset-0">
            <Visual kind={project.visual} />
          </div>
        )}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-cyan/[0.08]" />
      </div>
    </div>
  );
}

const bar = "rounded-full bg-line-strong";

function Visual({ kind }: { kind: Project["visual"] }) {
  switch (kind) {
    case "alt-text":
      return <AltTextVisual />;
    case "forms":
      return <FormsVisual />;
    case "crm":
      return <CrmVisual />;
    default:
      return <GenericVisual />;
  }
}

function AltTextVisual() {
  return (
    <div className="grid h-full grid-cols-5 gap-4 p-5 sm:p-6">
      <div className="relative col-span-3 overflow-hidden rounded-xl border border-line bg-gradient-to-br from-[#0c2a3d] via-[#0b3b46] to-[#1c2c5c]">
        <svg viewBox="0 0 300 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <circle cx="222" cy="58" r="22" fill="#67e8f9" opacity="0.85" />
          <path d="M0 200V130l60-46 50 40 70-70 120 96v50z" fill="#0f766e" opacity="0.9" />
          <path d="M0 200v-40l80-30 70 28 90-40 60 30v52z" fill="#083344" opacity="0.9" />
        </svg>
        <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[0.6rem] tracking-wider text-white/80">
          IMG_0412.jpg
        </span>
      </div>
      <div className="col-span-2 flex flex-col gap-3">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted">Alt text</span>
        <div className="flex-1 space-y-2 rounded-xl border border-line bg-bg-2 p-3">
          <div className={`${bar} h-2 w-full`} />
          <div className={`${bar} h-2 w-11/12`} />
          <div className={`${bar} h-2 w-2/3`} />
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald/40 px-2.5 py-1 font-mono text-[0.6rem] text-emerald">
          ✓ Generated
        </span>
        <div className="h-8 rounded-full bg-gradient-to-r from-cyan to-emerald opacity-90" />
      </div>
    </div>
  );
}

function FormsVisual() {
  return (
    <div className="mx-auto flex h-full max-w-[78%] flex-col justify-center gap-4 p-5">
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-1 flex-1 rounded-full ${i < 2 ? "bg-cyan" : "bg-line-strong"}`} />
        ))}
      </div>
      {[70, 45].map((w) => (
        <div key={w} className="space-y-2">
          <div className={`${bar} h-1.5`} style={{ width: `${w * 0.4}%` }} />
          <div className="h-9 rounded-lg border border-line bg-bg-2 px-3 py-3">
            <div className={`${bar} h-1.5`} style={{ width: `${w}%` }} />
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <span className="relative h-5 w-9 rounded-full bg-turquoise/80">
          <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
        </span>
        <div className={`${bar} h-1.5 w-1/3`} />
      </div>
      <div className="h-9 w-32 rounded-full bg-gradient-to-r from-purple to-blue shadow-[0_0_30px_-4px_var(--purple)]" />
    </div>
  );
}

function CrmVisual() {
  return (
    <div className="grid h-full grid-cols-[28%_1fr_26%] text-[0.6rem]">
      <div className="space-y-2.5 border-r border-line bg-bg-2 p-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex items-center gap-2 rounded-lg p-1.5 ${i === 1 ? "bg-bg-3" : ""}`}>
            <span className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-turquoise to-blue" />
            <span className="flex-1 space-y-1">
              <span className={`${bar} block h-1.5 w-4/5`} />
              <span className={`${bar} block h-1 w-1/2 opacity-60`} />
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-end gap-2.5 p-3">
        <div className="max-w-[70%] rounded-2xl rounded-bl-sm bg-bg-3 px-3 py-2.5">
          <div className={`${bar} h-1.5 w-24`} />
        </div>
        <div className="ml-auto max-w-[70%] rounded-2xl rounded-br-sm bg-emerald/80 px-3 py-2.5">
          <div className="h-1.5 w-28 rounded-full bg-white/70" />
          <div className="mt-1.5 h-1.5 w-16 rounded-full bg-white/50" />
        </div>
        <div className="max-w-[60%] rounded-2xl rounded-bl-sm bg-bg-3 px-3 py-2.5">
          <div className={`${bar} h-1.5 w-20`} />
        </div>
        <div className="mt-1 h-8 rounded-full border border-line bg-bg-2" />
      </div>
      <div className="space-y-3 border-l border-line bg-bg-2 p-3">
        <span className="mx-auto block h-10 w-10 rounded-full bg-gradient-to-br from-purple to-cyan" />
        {[80, 60, 70, 45].map((w) => (
          <div key={w} className={`${bar} h-1.5`} style={{ width: `${w}%` }} />
        ))}
        <div className="h-6 rounded-full border border-cyan/40" />
      </div>
    </div>
  );
}

function GenericVisual() {
  return (
    <div className="grid h-full grid-cols-3 grid-rows-2 gap-3 p-5">
      <div className="col-span-2 rounded-xl border border-line bg-gradient-to-br from-bg-3 to-bg-2" />
      <div className="rounded-xl border border-line bg-bg-2" />
      <div className="rounded-xl border border-line bg-bg-2" />
      <div className="col-span-2 rounded-xl border border-line bg-gradient-to-tr from-cyan/10 to-purple/10" />
    </div>
  );
}
