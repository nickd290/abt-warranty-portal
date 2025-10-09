interface BuckslipProps {
  idx: number;
  title: string;
  onClick?: () => void;
}

export function Buckslip({ idx, title, onClick }: BuckslipProps) {
  const designs = [
    {
      bg: 'bg-gradient-to-r from-sky-500 to-blue-600',
      pattern: 'Extended Warranty Protection',
      subtext: 'Protect Your Investment',
      accent: 'bg-sky-300',
    },
    {
      bg: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      pattern: 'Premium Service Plans',
      subtext: '24/7 Expert Support',
      accent: 'bg-blue-300',
    },
    {
      bg: 'bg-gradient-to-r from-indigo-600 to-purple-600',
      pattern: 'Exclusive Member Benefits',
      subtext: 'Save More Today',
      accent: 'bg-indigo-300',
    },
  ];

  const design = designs[idx % 3];

  return (
    <div
      onClick={onClick}
      className={`relative h-[52px] w-[126px] ${design.bg} rounded-lg shadow-xl cursor-pointer hover:scale-105 transition-transform duration-200 overflow-hidden group`}
      aria-label={`${title} ${idx + 1}`}
      style={{ aspectRatio: '2.43 / 1' }}
    >
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 right-2 w-20 h-20 rounded-full bg-white blur-2xl" />
        <div className="absolute bottom-2 left-2 w-16 h-16 rounded-full bg-white blur-xl" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-2">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <img
              src="/Abt-Electronics.png"
              alt="Abt Electronics"
              className="h-3 w-auto"
            />
          </div>
          <h3 className="text-[9px] font-bold text-white leading-tight">
            {design.pattern}
          </h3>
        </div>
        <div>
          <p className="text-[7px] text-white/80">{design.subtext}</p>
          <div className={`mt-1 h-0.5 w-8 ${design.accent} rounded-full`} />
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="text-[8px] font-semibold text-white bg-black/30 px-2 py-0.5 rounded-full">
          Click to preview
        </span>
      </div>
    </div>
  );
}

interface LetterReplyProps {
  onClick?: () => void;
}

export function LetterReply({ onClick }: LetterReplyProps) {
  return (
    <div
      onClick={onClick}
      className="relative h-[85px] w-[66px] rounded-lg bg-white shadow-2xl ring-1 ring-black/10 cursor-pointer hover:scale-105 transition-transform duration-200 overflow-hidden group"
      style={{ aspectRatio: '8.5 / 11' }}
    >
      {/* ABT Logo and Header */}
      <div className="p-1.5 border-b border-gray-200">
        <div className="flex items-center gap-1">
          <img
            src="/Abt-Electronics.png"
            alt="Abt Electronics"
            className="h-4 w-auto"
          />
          <div className="text-[5px] text-gray-500">Since 1936</div>
        </div>
      </div>

      {/* Letter Content */}
      <div className="p-1.5 space-y-1">
        <div className="text-[5px] text-gray-600 space-y-0.5">
          <p className="font-semibold">Dear Valued Customer,</p>
          <p>
            Thank you for your recent purchase. We're writing to remind you
            about your warranty coverage...
          </p>
        </div>

        {/* Mock text lines */}
        <div className="space-y-0.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-0.5 bg-gray-200 rounded" />
          ))}
        </div>

        {/* Signature area */}
        <div className="pt-1 mt-1 border-t border-gray-100">
          <div className="h-1 w-8 bg-gray-300 rounded mb-0.5" />
          <div className="text-[4px] text-gray-500">Customer Service Team</div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="text-[8px] font-semibold text-gray-800 bg-white/80 px-2 py-0.5 rounded-full shadow">
          Click to preview
        </span>
      </div>
    </div>
  );
}

interface EnvelopeProps {
  open?: boolean;
  onClick?: () => void;
}

export function Envelope({ open = true, onClick }: EnvelopeProps) {
  return (
    <div
      onClick={onClick}
      className="relative h-[52px] w-[100px] cursor-pointer hover:scale-105 transition-transform duration-200 group"
    >
      {/* #10 Envelope body */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-2xl border border-slate-300" />

      {/* ABT Logo and Return Address */}
      <div className="absolute top-1.5 left-2 z-10">
        <div className="flex items-center gap-1 mb-0.5">
          <img
            src="/Abt-Electronics.png"
            alt="Abt Electronics"
            className="h-2.5 w-auto"
          />
        </div>
        <div className="text-[4px] text-gray-600 leading-tight">
          <div>1200 N Milwaukee Ave</div>
          <div>Glenview, IL 60025</div>
        </div>
      </div>

      {/* Stamp area */}
      <div className="absolute top-1.5 right-2 w-4 h-3 border-2 border-dashed border-gray-400 rounded-sm flex items-center justify-center">
        <span className="text-[5px] text-gray-500 font-bold">STAMP</span>
      </div>

      {/* Envelope flap with animation */}
      <div
        className={`absolute left-0 right-0 mx-auto top-0 transition-transform duration-700 origin-top ${
          open ? '' : 'rotate-x-180'
        }`}
        style={{
          width: '88%',
          height: 0,
          borderLeft: '18px solid transparent',
          borderRight: '18px solid transparent',
          borderTop: `30px solid ${open ? '#e2e8f0' : '#cbd5e1'}`,
          transformStyle: 'preserve-3d',
        }}
      />

      {/* Address window (showing through) */}
      {!open && (
        <div className="absolute bottom-3 right-4 left-4 bg-white/40 rounded p-1 border border-slate-300">
          <div className="text-[4px] text-gray-600 leading-tight">
            <div className="font-semibold">John Doe</div>
            <div>123 Main Street</div>
            <div>Chicago, IL 60601</div>
          </div>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-xl">
        <span className="text-[8px] font-semibold text-gray-800 bg-white/80 px-2 py-0.5 rounded-full shadow">
          Click to preview
        </span>
      </div>
    </div>
  );
}

export function SequenceDot({ active }: { active: boolean }) {
  return (
    <div
      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
        active ? 'bg-sky-400 scale-110' : 'bg-white/25 scale-100'
      }`}
    />
  );
}
