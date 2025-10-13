interface BuckslipProps {
  idx: number;
  title: string;
  onClick?: () => void;
}

export function Buckslip({ idx, title, onClick }: BuckslipProps) {
  const imageFiles = [
    '/ABT-8.5x3.5-1.png',
    '/ABT-8.5x3.5-2.png',
    '/ABT-8.5x3.5-3.png',
  ];

  const imageSrc = imageFiles[idx % 3];

  // Buckslip dimensions: 8.5" × 3.5" = 2.43:1 ratio (fits inside #10 envelope)
  // Specs: 100# Gloss Text, 4/4, AQ Coating Each Side
  return (
    <div
      onClick={onClick}
      className="relative w-[200px] h-[82px] rounded-sm shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 overflow-hidden group ring-1 ring-gray-300 bg-white"
      aria-label={`${title} ${idx + 1}`}
      style={{ aspectRatio: '2.43 / 1' }}
      title="8.5×3.5 - 100# Gloss Text, 4/4, AQ Coating Each Side"
    >
      {/* Actual artwork image */}
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          console.error(`Failed to load buckslip image: ${imageSrc}`);
          e.currentTarget.style.display = 'none';
        }}
        onLoad={() => console.log(`Loaded buckslip image: ${imageSrc}`)}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="text-center">
          <span className="text-xs font-semibold text-white bg-black/60 px-2 py-1 rounded-full block mb-1">
            Click to preview
          </span>
          <span className="text-[10px] font-medium text-white bg-black/60 px-2 py-0.5 rounded-full block">
            100# Gloss Text, 4/4, AQ Coating
          </span>
        </div>
      </div>
    </div>
  );
}

interface LetterReplyProps {
  onClick?: () => void;
  folded?: boolean;
}

export function LetterReply({ onClick, folded = false }: LetterReplyProps) {
  if (folded) {
    // Tri-folded letter: 8.5" × 3.67" (fits in #10 envelope)
    // Specs: 8.5x14 - 70# Uncoated Opaque Text, 4/4
    return (
      <div
        onClick={onClick}
        className="relative w-[200px] h-[86px] rounded-sm shadow-lg ring-1 ring-gray-300 cursor-pointer hover:scale-105 transition-transform duration-200 overflow-hidden group bg-white"
        style={{ aspectRatio: '8.5 / 3.67' }}
        title="8.5×14 - 70# Uncoated Opaque Text, 4/4"
      >
        {/* Folded letter appearance - show top third of letter */}
        <div className="absolute inset-0">
          <img
            src="/ABT-8.5x14.png"
            alt="Tri-Folded Letter"
            className="absolute w-full h-[300%] object-cover"
            style={{ top: '0%' }}
            onError={(e) => {
              console.error('Failed to load tri-folded letter image: /ABT-8.5x14.png');
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => console.log('Loaded tri-folded letter image: /ABT-8.5x14.png')}
          />
        </div>

        {/* Fold lines to show it's folded */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-gray-400/30" />
          <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-gray-400/30" />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="text-center px-1">
            <span className="text-xs font-semibold text-white bg-black/60 px-2 py-1 rounded-full shadow block mb-1">
              Click to preview
            </span>
            <span className="text-[10px] font-medium text-white bg-black/60 px-2 py-0.5 rounded-full block">
              8.5×14 - 70# Uncoated Opaque Text, 4/4
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Full unfolded letter (for queue display)
  return (
    <div
      onClick={onClick}
      className="relative h-[85px] w-[66px] rounded-lg shadow-2xl ring-1 ring-gray-300 cursor-pointer hover:scale-105 transition-transform duration-200 overflow-hidden group bg-white"
      style={{ aspectRatio: '8.5 / 11' }}
      title="8.5×14 - 70# Uncoated Opaque Text, 4/4"
    >
      {/* Actual artwork image */}
      <img
        src="/ABT-8.5x14.png"
        alt="Letter Reply"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          console.error('Failed to load unfolded letter image: /ABT-8.5x14.png');
          e.currentTarget.style.display = 'none';
        }}
        onLoad={() => console.log('Loaded unfolded letter image: /ABT-8.5x14.png')}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="text-center">
          <span className="text-xs font-semibold text-white bg-black/60 px-2 py-1 rounded-full shadow block mb-1">
            Click to preview
          </span>
          <span className="text-[10px] font-medium text-white bg-black/60 px-2 py-0.5 rounded-full block">
            8.5×14 - 70# Uncoated Opaque Text, 4/4
          </span>
        </div>
      </div>
    </div>
  );
}

interface EnvelopeProps {
  open?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  hasInserts?: boolean;
  recipientName?: string;
  recipientAddress?: string;
}

export function Envelope({ open = true, onClick, children, hasInserts = false, recipientName, recipientAddress }: EnvelopeProps) {
  // #10 Envelope - Full-screen focal point using actual ABT envelope artwork
  // Specs: #10 on 24# White Wove 4/0
  return (
    <div
      onClick={onClick}
      className="relative w-full h-full cursor-pointer group"
      style={{ aspectRatio: '2.3 / 1', maxHeight: '100%', margin: 'auto' }}
      title="#10 on 24# White Wove 4/0"
    >
      {/* Actual envelope artwork - solid focal point */}
      <div className="absolute inset-0 bg-white shadow-2xl">
        <img
          src="/ABT-No10.png"
          alt="#10 Envelope"
          className="w-full h-full object-contain"
          onError={(e) => {
            console.error('Failed to load envelope image: /ABT-No10.png');
          }}
          onLoad={() => console.log('Loaded envelope image: /ABT-No10.png')}
        />
      </div>

      {/* Recipient Address - overlaid on envelope */}
      {recipientName && recipientAddress && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-gray-800 font-serif bg-white px-8 py-4 rounded shadow-sm" style={{ marginTop: '8%', marginLeft: '10%', minWidth: '200px', minHeight: '80px' }}>
            <div className="text-sm font-semibold">{recipientName}</div>
            <div className="text-xs whitespace-pre-line">{recipientAddress}</div>
          </div>
        </div>
      )}

      {/* Inserts container - animates INTO envelope */}
      <div className="absolute inset-0 flex items-center justify-center overflow-visible">
        {children}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-30 pointer-events-none">
        <div className="text-center pointer-events-auto">
          <span className="text-base font-semibold text-white bg-black/60 px-4 py-2 rounded-full shadow block mb-2">
            Click to preview
          </span>
          <span className="text-sm font-medium text-white bg-black/60 px-4 py-1.5 rounded-full shadow block">
            #10 on 24# White Wove 4/0
          </span>
        </div>
      </div>
    </div>
  );
}

export function SequenceDot({ active }: { active: boolean }) {
  return (
    <div
      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
        active ? 'bg-slate-600 scale-110' : 'bg-white/25 scale-100'
      }`}
    />
  );
}
