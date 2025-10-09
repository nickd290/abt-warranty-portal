# Abt Electronics Warranty Mailer Portal

A modern React + TypeScript web application for managing monthly warranty mailer campaigns. This portal streamlines the workflow from asset upload to proof approval to printing and invoicing.

## Features

### 📊 Job Dashboard
- View all monthly mailer jobs in one place
- Track job status through the complete workflow
- Quick access to job details and actions
- Real-time statistics (total jobs, in progress, completed)

### 📤 Upload & Job Setup
- Create new monthly campaigns
- Upload required assets:
  - 3 monthly buckslips (promotional inserts)
  - Letter reply template with merge fields
  - Outer envelope design
  - Mail list (CSV/Excel)
- Drag-and-drop file upload interface
- Save drafts or submit directly for proofing

### 🔍 Proofing Room
- Interactive inserting sequence viewer
  - Step through the mail piece assembly process
  - See how buckslips stack with letter reply
  - Preview final envelope package
- Sample letter carousel (10 personalized examples)
- Zoom and pan controls for detailed review
- Add notes and comments
- Approve or request changes

### 💰 Printing & Invoicing
- Track print job status
- Automated invoice generation
- Detailed cost breakdown:
  - Mail count × rate per piece
  - Tax calculation
  - Total amount
- Download invoice as PDF
- Print invoice functionality

### ⚙️ Settings
- Account management
- Notification preferences
- Appearance customization
- Security settings

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **File Uploads**: react-dropzone
- **Icons**: Lucide React

## Project Structure

```
abt-warranty-portal/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   └── ui/
│   │       ├── FileUpload.tsx
│   │       └── StatusBadge.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Upload.tsx
│   │   ├── Proofing.tsx
│   │   ├── Invoicing.tsx
│   │   └── Settings.tsx
│   ├── store/
│   │   └── useJobStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── mockData.ts
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Navigate to the project directory:
```bash
cd abt-warranty-portal
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Workflow

The application follows this workflow for each monthly campaign:

1. **Create Job** → Set month, year, and campaign name
2. **Upload Assets** → Upload all required files (buckslips, letter, envelope, mail list)
3. **Submit for Proofing** → Generate proof samples
4. **Review Proofs** → Interactive proof review with inserting sequence
5. **Approve/Request Changes** → Either approve or send back for revisions
6. **Printing** → Approved jobs move to print status
7. **Invoicing** → Automatic invoice generation
8. **Complete** → Job marked complete after mailing

## Job Statuses

- **Draft** → Initial state, assets being prepared
- **Assets Uploaded** → All files uploaded, ready for proofing
- **Proofing** → In review phase
- **Approved** → Approved for printing
- **Printing** → Currently being printed
- **Invoiced** → Invoice generated
- **Complete** → Fully completed and mailed

## Mock Data

The application comes pre-loaded with 3 sample jobs demonstrating different statuses:
- Q4 Warranty Push (October 2025) - Complete
- Holiday Warranty Campaign (November 2025) - Proofing
- Year-End Warranty Reminder (December 2025) - Draft

## Customization

### Theme Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  dark: {
    bg: '#1a1d23',      // Main background
    card: '#22252b',     // Card background
    hover: '#2a2d35',    // Hover state
  },
  primary: {
    DEFAULT: '#2563eb',  // Primary blue
    hover: '#1d4ed8',    // Primary hover
  },
  accent: {
    cyan: '#06b6d4',     // Accent cyan
  }
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Future Enhancements

- [ ] Real PDF preview functionality
- [ ] Backend API integration
- [ ] User authentication
- [ ] Email notifications
- [ ] Advanced reporting and analytics
- [ ] Bulk job operations
- [ ] Template management
- [ ] Customer database integration

## License

Proprietary - Abt Electronics

## Support

For issues or questions, contact the development team.
