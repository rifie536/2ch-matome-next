# 2chまとめ+ (2ch Matome Plus)

A modern, performant 2ch thread aggregator built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Modern Stack**: Built with Next.js 15, React 18, and TypeScript
- 💅 **Beautiful UI**: Dark theme with smooth animations using Framer Motion
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ♾️ **Infinite Scroll**: Seamlessly load more threads as you scroll
- 🔍 **Search Functionality**: Find threads quickly with integrated search
- 📊 **Real-time Stats**: View thread momentum, response counts, and trending topics
- 🎯 **Thread Details**: Full thread view with response threading

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 2ch-matome-next
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
2ch-matome-next/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── thread/[id]/       # Thread detail pages
│   └── providers.tsx      # React Query provider
├── components/            # Reusable UI components
│   ├── Header.tsx        # Navigation header
│   ├── ThreadCard.tsx    # Thread card component
│   └── Sidebar.tsx       # Sidebar widgets
├── lib/                  # Utility functions and API
│   ├── api.ts           # API client
│   └── utils.ts         # Helper functions
├── types/               # TypeScript type definitions
│   └── thread.ts        # Thread-related types
└── hooks/               # Custom React hooks
    └── useThreads.ts    # Thread data fetching hooks
```

## API Integration

Currently using mock data. To integrate with real 2ch API:

1. Update `lib/api.ts` with actual API endpoints
2. Configure CORS if needed
3. Set `NEXT_PUBLIC_API_URL` environment variable

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Future Enhancements

- [ ] Real 2ch API integration
- [ ] User authentication
- [ ] Bookmarking system
- [ ] Advanced filtering options
- [ ] Dark/Light theme toggle
- [ ] PWA support
- [ ] Thread notifications

## License

MIT