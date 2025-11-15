# Doctora Frontend

A modern web application built with Next.js 15 and React 19 for healthcare management system.

## Technology Stack

- **Frontend Framework**: Next.js 15.5.2
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS v4
- **TypeScript**: Full TypeScript support
- **UI Components**: Lucide React icons, Class Variance Authority
- **Development**: ESLint for code linting

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd doctora_front
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code checking

## Project Structure

```
doctora_front/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── lib/                # Utility functions
├── public/             # Static assets
├── components.json     # shadcn/ui configuration
└── package.json        # Project dependencies
```

## Features

- Modern Next.js App Router architecture
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Component-based architecture
- Optimized build and deployment ready

## Development

This project uses:
- **App Router**: Next.js 15's new routing system
- **Server Components**: For better performance
- **Tailwind CSS**: For utility-first styling
- **TypeScript**: For enhanced development experience

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and not open for public distribution.
