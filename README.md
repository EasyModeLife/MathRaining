# Math Raining

A comprehensive math training application built with Svelte, designed to help students practice and master arithmetic and calculus skills through progressive levels and timed challenges.

## 🎯 Features

### Arithmetic Training
- **20 Progressive Levels**: From basic single-digit operations to advanced three-digit calculations
- **Multiple Operations**: Addition, subtraction, multiplication, and division
- **Smart Practice**: Focus on specific multiplication tables and patterns
- **Time Challenges**: Test speed and accuracy under time constraints

### Calculus Training
- **Derivative Practice**: Polynomial derivatives with automatic answer validation
- **Integral Problems**: Basic integration rules practice
- **Trigonometric Functions**: Derivatives of sin, cos, and tan
- **Enhanced Answer Recognition**: Supports various input formats and normalizes expressions

### Game Mechanics
- **Level Progression**: Advance through levels by completing required exercises
- **Time-Based Scoring**: Different problems have appropriate time limits
- **Answer Validation**: Flexible input recognition with normalization
- **Performance Tracking**: Correct/incorrect counters per level

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/EasyModeLife/RainingMath.git
cd RainingMath
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Play

### Arithmetic Mode
1. Choose your starting level (1-20)
2. Select operations and number ranges
3. Solve problems before time runs out
4. Complete required exercises to advance

### Calculus Mode
1. Choose calculus topics: derivatives, integrals, or trigonometry
2. Enter answers using standard mathematical notation
3. Support for:
   - Polynomials: `3x^2 + 5x - 2`
   - Exponents: `x^2` (use ^ instead of ^{ })
   - Trigonometry: `cos x`, `sin x`, `tan x`
   - Integrals: Include `+ C` for definite answers

## 📝 Input Guidelines

### Calculus Answer Format
- **Exponents**: Use `x^2` instead of `x^{2}`
- **Fractions**: Use `/` for fractions (e.g., `1/2` vs `\\frac{1}{2}`)
- **Trig Functions**: Use `cos x` instead of `\\cos x`
- **Spaces**: Minimal spacing for better recognition

### Examples
- `d/dx[x^2] = 2x` → Input: `2x`
- `d/dx[3x^6 + 5x] = 18x^5 + 5` → Input: `18x^5 + 5`
- `∫x dx = x^2/2 + C` → Input: `x^2/2 + C`

## 🛠 Technical Details

### Tech Stack
- **Framework**: Svelte 4
- **Build Tool**: Vite
- **Math Rendering**: KaTeX
- **Testing**: Vitest with jsdom
- **TypeScript**: Full type safety

### Project Structure
```
src/
├── components/          # UI components
├── games/
│   ├── arithmetic/     # Arithmetic training module
│   └── calculus/       # Calculus training module
├── logic/              # Game state and utilities
├── pages/              # Application pages
├── router/             # Client-side routing
├── styles/             # Global styles
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

### Key Components
- **Arithmetic Levels**: Progressive curriculum with focused practice
- **Problem Generation**: Dynamic math problem creation
- **Answer Normalization**: Flexible answer matching system
- **Level Progression**: Automatic advancement system
- **Responsive Design**: Mobile-friendly interface

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

## 📦 Deployment

The application can be deployed to any static hosting service. Build the project and upload the `dist` folder:

```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with Svelte for modern web development
- Math rendering powered by KaTeX
- Game design inspired by classic educational software

---

**Happy Learning!** 🎓🧮
