import React, { useState } from 'react';
import {
  Archive,
  Eye,
  MessageSquareText,
  Radio,
  ShieldCheck,
  Target,
} from 'lucide-react';

const flowImagePath = '/discussion-assets/social-influence-flow.png';

const possibleRoles = [
  {
    title: 'Watchlist Builder',
    icon: Eye,
    fit: 'Identify prominent antisemitic influencer accounts.',
    question: 'Could TextLens help rank a top 50 or 100 watchlist?',
  },
  {
    title: 'Response Desk',
    icon: MessageSquareText,
    fit: 'Decide whether a response is worth making.',
    question: 'Who is the audience: followers, institutions, or the poster?',
  },
  {
    title: 'Counter-Framing',
    icon: Target,
    fit: 'Frame responses without becoming defensive.',
    question: 'Is the task to reframe, verify, disprove, or some mix of these?',
  },
  {
    title: 'Evidence Collection',
    icon: Archive,
    fit: 'Collect sources, timing, claims, screenshots, and next-step notes.',
    question: 'Is the value public response, quiet follow-up, or record-keeping?',
  },
];

const openDecisions = [
  'Is this part of a product, a training tool, or a way to learn from partners what is worth building?',
  'Should TextLens monitor feeds directly, or only help teams build a watchlist?',
  'What is the workflow, including the role of fact-checking?',
  'What does success look like: fewer bad replies, faster response, better evidence, or clearer response rules?',
];

export default function SocialMediaTab() {
  const [notes, setNotes] = useState('');

  return (
    <div id="social-media-tab-container" className="space-y-6 pb-10">
      <section className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-150 bg-slate-50/60 flex items-start gap-3">
          <div className="rounded-md border border-cyan-100 bg-cyan-50 p-2.5 text-cyan-800 shrink-0">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 font-display">Social Response Lab</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-4xl">
              A working page for partner discussion about whether TextLens should build in this space, and where it could help.
            </p>
          </div>
        </div>

        <div className="p-5 space-y-6">
          <figure className="rounded-md border border-slate-200 bg-slate-50/60 p-3">
            <img
              src={flowImagePath}
              alt="Modern information flow and strategic intervention map"
              className="block w-full rounded-sm border border-slate-200 bg-white"
            />
          </figure>

          <section className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            {possibleRoles.map(role => {
              const Icon = role.icon;
              return (
                <div key={role.title} className="rounded-md border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-cyan-700" />
                    <h3 className="text-xs font-bold text-slate-950">{role.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">{role.fit}</p>
                  <div className="rounded-md border border-slate-200 bg-slate-50/65 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
                    {role.question}
                  </div>
                </div>
              );
            })}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4">
            <div className="rounded-md border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-700" />
                <h3 className="text-xs font-bold text-slate-950">Open Decisions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {openDecisions.map(decision => (
                  <div key={decision} className="rounded-md border border-slate-200 bg-slate-50/65 px-3 py-2 text-xs leading-relaxed text-slate-700">
                    {decision}
                  </div>
                ))}
              </div>
            </div>

            <label className="rounded-md border border-slate-200 bg-white p-4 space-y-3 block">
              <span className="block text-xs font-bold text-slate-950">Partner Notes</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={8}
                placeholder="Capture reactions, missing stages, possible partner needs, or reasons not to build."
                className="w-full rounded-md border border-slate-200 bg-slate-50/55 px-3 py-2 text-xs leading-relaxed text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400"
              />
            </label>
          </section>
        </div>
      </section>
    </div>
  );
}
