import {
  Activity,
  Network,
  Code2,
  Server,
  Database,
  Cloud,
  Gauge,
  Users,
} from "lucide-react";
import Reveal from "./Reveal.jsx";
import { skillGroups } from "../data/resumeData.js";

// Maps each skill group title to an icon that reflects its subject matter
const ICONS = {
  "Cloud Operations & SRE": Activity,
  "Operating Systems & Networking": Network,
  "Programming & Scripting": Code2,
  "Backend & APIs": Server,
  "Databases & Data": Database,
  "Cloud Platforms & Infrastructure": Cloud,
  "Monitoring, Observability & Tooling": Gauge,
  "Process & Collaboration": Users,
};

function SkillCard({ group }) {
  const Icon = ICONS[group.title] || Activity;

  return (
    <Reveal.Item className="card card-hover p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal/10 text-signal-dark dark:text-signal">
          <Icon size={18} />
        </span>
        <h3 className="font-display font-semibold text-base text-graphite dark:text-white">
          {group.title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <span key={skill} className="tag-chip">
            {skill}
          </span>
        ))}
      </div>
    </Reveal.Item>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="px-6 sm:px-8 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-14 max-w-2xl">
          {/* <p className="section-eyebrow">// Capabilities</p> */}
          <h2 className="section-heading">Skills by domain</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Grouped the way I actually use them - operating systems day to day,
            reaching for programming languages when I need to, and drawing on
            the rest as needed.
          </p>
        </Reveal>

        <Reveal stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group) => (
            <SkillCard key={group.title} group={group} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
