# Contributing to Platera

Thank you for your interest in contributing to Platera! We welcome contributions from everyone.

## 🌟 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit bug fixes
- ✨ Add new features
- 🎨 Improve UI/UX

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/Platera.git
cd Platera

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/Platera.git
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Set up database
npx prisma migrate dev
npx prisma generate

# Run development server
npm run dev
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

## 📋 Development Guidelines

### Code Style

- **TypeScript** - Use TypeScript for all new code
- **No `any` types** - Use proper type definitions
- **ESLint** - Follow the existing ESLint configuration
- **Formatting** - Code is auto-formatted (Prettier-compatible)

### Naming Conventions

- **Components** - PascalCase (e.g., `RecipeCard.tsx`)
- **Utilities** - camelCase (e.g., `sanitizeInput.ts`)
- **API Routes** - kebab-case folders (e.g., `api/recipes/[id]`)
- **Variables** - camelCase (e.g., `userName`)
- **Constants** - UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add recipe search functionality
fix: resolve image upload error
docs: update README with new features
style: format code with prettier
refactor: extract duplicate code into utility
test: add tests for recipe API
chore: update dependencies
```

### Code Quality Checklist

Before submitting a PR, ensure:

- [ ] Code follows TypeScript best practices
- [ ] No `any` types used
- [ ] All user input is sanitized
- [ ] Error handling is implemented
- [ ] Accessibility standards met (ARIA labels, keyboard navigation)
- [ ] Responsive design works on mobile
- [ ] No console.logs in production code (use `logger` utility)
- [ ] Code is properly formatted

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Build the project
npm run build

# Test locally
npm run dev
```

## 📝 Pull Request Process

1. **Update Documentation** - If you add features, update the README
2. **Test Thoroughly** - Ensure your changes work as expected
3. **Write Clear Description** - Explain what and why
4. **Link Issues** - Reference related issues (e.g., "Fixes #123")
5. **Request Review** - Tag maintainers for review

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test this?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
```

## 🐛 Reporting Bugs

Use GitHub Issues with the bug template:

**Title:** Clear, descriptive title

**Description:**
- What happened?
- What did you expect?
- Steps to reproduce
- Environment (OS, browser, Node version)
- Screenshots/error messages

## 💡 Suggesting Features

Use GitHub Issues with the feature template:

**Title:** Clear feature request

**Description:**
- Problem it solves
- Proposed solution
- Alternative solutions considered
- Additional context

## 🏗️ Project Architecture

### Key Directories

- `app/` - Next.js app router pages and API routes
- `components/` - Reusable React components
- `lib/` - Utility functions and helpers
- `prisma/` - Database schema and migrations
- `types/` - TypeScript type definitions

### Important Files

- `lib/auth.ts` - Authentication logic
- `lib/logger.ts` - Error logging
- `lib/sanitize.ts` - Input sanitization
- `lib/api-response.ts` - API response helpers

## 🔒 Security

- **Never commit** `.env` files
- **Sanitize** all user input
- **Validate** all API inputs
- **Use** type-safe error handling
- **Report** security issues privately

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ❓ Questions?

- Open a GitHub Discussion
- Check existing issues
- Read the documentation

## 🙏 Thank You!

Every contribution, no matter how small, is valued and appreciated!

---

Happy coding! 🚀
