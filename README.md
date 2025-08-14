# Meet the Moment - Interactive Meeting Agenda Dashboard

Transform executive briefings into dynamic, interactive meeting agendas with real-time editing and priority management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61dafb.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38bdf8.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

## 🎯 Overview

Meet the Moment is a stateless web application designed for meeting facilitators and executive teams to transform static briefing documents into interactive, reorderable meeting agendas. No data is stored - everything runs locally in your browser for complete privacy and security.

### Key Features

- 📝 **Smart Text Parsing** - Automatically converts briefing text into structured agenda items
- 🎯 **Priority Management** - Visual priority indicators with color-coded system
- 🔄 **Drag & Drop Reordering** - Real-time reorganization during meetings
- ✏️ **Inline Editing** - Update titles and descriptions on the fly
- 📊 **Status Tracking** - Mark items as Open, Discussed, Complete, or Deferred
- 🅿️ **Parking Lot** - Automatic section for deferred items
- ⌨️ **Keyboard Shortcuts** - Efficient navigation and control
- 📤 **Export Options** - Download as Markdown or copy to clipboard
- 🔒 **Privacy First** - No data persistence, everything stays local

## 🚀 Quick Start

### Live Demo
Visit the deployed application: [Meet the Moment Dashboard](https://meet-the-moment.netlify.app)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/meet-the-moment.git
cd meet-the-moment
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

## 💡 How to Use

### Input Methods

1. **Paste Text**: Copy your briefing text and paste it into the text area
2. **Upload File**: Drag and drop or click to upload .txt or .md files

### Text Format Examples

```markdown
1. [URGENT] Budget Review
   Rationale: Q4 spending needs approval
   Target Outcome: Approved budget allocation

2. Product Launch Timeline
   Description: Review launch milestones and dependencies
   Target Outcome: Confirmed launch date

* [HIGH] Security Audit Findings
  - Multiple vulnerabilities identified
  - Immediate action required
```

### Priority Levels

- 🔴 **Critical/Immediate** - Red border (#EF4444)
- 🟠 **Urgent** - Orange border (#F97316)
- 🟡 **High** - Yellow border (#EAB308)
- 🔵 **Medium** - Blue border (#3B82F6)
- 🟣 **Ongoing/Low** - Purple border (#8B5CF6)

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ↑/↓ | Navigate between items |
| Shift + ↑/↓ | Reorder items |
| Space/Enter | Expand/Collapse item |
| E | Edit mode |
| 1-5 | Set priority level |

## 🛠 Tech Stack

- **Framework**: React 18.2 with Vite
- **Styling**: Tailwind CSS 3.0
- **Drag & Drop**: @dnd-kit/sortable
- **File Handling**: react-dropzone
- **Icons**: Lucide React
- **Export**: file-saver
- **Deployment**: Netlify

## 📁 Project Structure

```
meet-the-moment/
├── src/
│   ├── components/
│   │   ├── AgendaCard.jsx      # Interactive agenda item component
│   │   └── FileUpload.jsx      # Drag-and-drop file upload
│   ├── utils/
│   │   ├── textParser.js       # Smart text parsing logic
│   │   └── exportUtils.js      # Markdown export functionality
│   ├── hooks/
│   │   └── useKeyboardShortcuts.js  # Keyboard navigation
│   ├── App.jsx                  # Main application component
│   └── index.css                # Global styles with Tailwind
├── public/
│   └── _redirects               # Netlify SPA routing
├── netlify.toml                 # Netlify configuration
└── package.json                 # Dependencies and scripts
```

## 🎨 Design System

### Colors
- **Primary Teal**: #5EEAD4
- **Primary Dark**: #0F766E
- **Background Cream**: #FEF9E7
- **Accent Yellow**: #FDE68A
- **Text Primary**: #1E293B
- **Text Secondary**: #64748B

### Typography
- **Font Family**: Inter, system-ui, -apple-system, sans-serif
- **Base Size**: 16px
- **Line Height**: 1.5

## 📊 Use Cases

### Executive Meetings
- Board meetings and strategic planning sessions
- Quarterly business reviews
- Executive team standups

### Project Management
- Sprint planning and retrospectives
- Stakeholder briefings
- Cross-functional team alignment

### Consulting
- Client strategy sessions
- Workshop facilitation
- Advisory board meetings

## 🔒 Privacy & Security

- **No Data Storage**: All processing happens locally in your browser
- **No External APIs**: No data leaves your device
- **Stateless Design**: Refresh the page to clear everything
- **Secure by Default**: Perfect for sensitive executive discussions

## 📈 Performance

- **Lightweight**: ~100KB gzipped bundle size
- **Fast Load**: < 1 second initial load
- **Responsive**: Smooth animations and interactions
- **Accessible**: WCAG AA compliant

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React and Tailwind CSS
- Drag and drop powered by @dnd-kit
- Icons from Lucide React
- Deployed on Netlify

## 📧 Contact

For questions, suggestions, or feedback, please open an issue on GitHub.

---

**Made with ❤️ for efficient meeting facilitation**