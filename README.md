# 🍽️ Platera

A modern, full-stack recipe sharing platform built with Next.js 14, TypeScript, and Prisma. Share your culinary creations, discover new recipes, and connect with food enthusiasts worldwide.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## ✨ Features

- 🔐 **Secure Authentication** - Powered by Clerk with OAuth support (Google, Discord)
- 📝 **Recipe Management** - Create, edit, and delete your recipes with rich media support
- ⭐ **Reviews & Ratings** - Rate and review recipes from the community
- 🔍 **Smart Filtering** - Filter by category (Veg, Non-Veg, Egg), cooking time, and ratings
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🎨 **Modern Stack** - Built with Next.js 14, TypeScript, and Tailwind CSS
- 🖼️ **Image Upload** - Cloudinary integration for optimized image hosting
- ♿ **Accessible** - WCAG compliant with keyboard navigation and screen reader support
- 🛡️ **Secure** - XSS prevention, input sanitization, and type-safe error handling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Clerk account (for authentication)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Platera.git
   cd Platera
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   DATABASE_URL="postgresql://..."
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
   CLERK_SECRET_KEY="sk_..."
   CLERK_WEBHOOK_SECRET="whsec_..."
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
   CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Clerk (authentication)

**Services:**
- Cloudinary (image hosting)
- Vercel (deployment)

## 📁 Project Structure

```
Platera/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── explore/           # Recipe browsing
│   ├── dashboard/         # User dashboard
│   ├── create/            # Recipe creation
│   └── sign-in/           # Authentication pages
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── recipes/          # Recipe-related components
│   └── user/             # User-related components
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication helpers
│   ├── logger.ts         # Error logging
│   ├── sanitize.ts       # Input sanitization
│   └── prisma.ts         # Prisma client
├── prisma/               # Database schema
└── types/                # TypeScript types
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit with conventional commits (`git commit -m 'feat: add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Clerk](https://clerk.com/) - Authentication platform
- [Prisma](https://www.prisma.io/) - Database ORM
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [Vercel](https://vercel.com/) - Deployment platform

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ by the Platera community
