# Intangible

A modern web application built with Nuxt 3, featuring event management, user authentication, and real-time interactions.

## 🚀 Features

- **Event Management System**
  - Create and manage events
  - Event check-in functionality
  - Group assignments
  - Event bidding system

- **User Authentication**
  - Discord OAuth integration
  - User profiles
  - Role-based access control

- **Modern Tech Stack**
  - Nuxt 3 for server-side rendering
  - TypeScript for type safety
  - TailwindCSS for styling
  - Supabase for backend services
  - MongoDB integration
  - Pinia for state management

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- Yarn package manager (v4.9.1 or later)
- MongoDB instance
- Supabase account
- Discord Developer account (for OAuth)

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:am0ka/intangible.git
   cd intangible
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Supabase
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key

   # MongoDB
   MONGODB_URI=your_mongodb_uri

   # Discord OAuth
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   DISCORD_CALLBACK_URL=your_callback_url
   ```

## 🚀 Development

Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
intangible/
├── assets/          # Static assets (CSS, images)
├── components/      # Vue components
├── composables/     # Vue composables
├── content/         # Content files
├── layouts/         # Page layouts
├── middleware/      # Route middleware
├── pages/          # Application pages
├── public/         # Public static files
├── server/         # Server-side code
│   ├── api/        # API endpoints
│   ├── models/     # Database models
│   └── utils/      # Utility functions
├── stores/         # Pinia stores
├── supabase/       # Supabase configuration
└── types/          # TypeScript type definitions
```

## 🛠️ Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn generate` - Generate static site
- `yarn preview` - Preview production build
- `yarn migrate-events` - Run event migration script
- `yarn migrate-to-supabase` - Run Supabase migration script

## 🔧 Configuration

### Nuxt Configuration
The application uses Nuxt 3 with the following key modules:
- `@nuxt/content` - Content management
- `@nuxt/ui` - UI components
- `@nuxtjs/supabase` - Supabase integration
- `@pinia/nuxt` - State management

### TailwindCSS
Custom styling is configured in `tailwind.config.js`

### TypeScript
TypeScript configuration is in `tsconfig.json`

## 📦 Dependencies

### Core Dependencies
- Nuxt 3
- Vue 3
- TypeScript
- TailwindCSS
- Supabase
- MongoDB
- Pinia

### Development Dependencies
- ESLint
- TypeScript types
- Development utilities

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **am0ka** - *Initial work*

## 🙏 Acknowledgments

- Nuxt.js team for the amazing framework
- Supabase team for the backend services
- All contributors who have helped shape this project
