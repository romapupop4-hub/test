# UI Asset Gallery

A comprehensive web application for discovering, organizing, and sharing UI components, styles, and assets. Built with React, Express.js, and MariaDB.

![UI Asset Gallery](https://via.placeholder.com/1200x400/6366f1/ffffff?text=UI+Asset+Gallery)

## Features

- **Component Gallery** - Browse and discover UI components with category filtering
- **Category Management** - Organize components into hierarchical categories
- **Style Variations** - Multiple style variants (HTML, CSS, React) for each component
- **Search & Filter** - Find components by name, description, or tags
- **Favorites** - Save your favorite components for quick access
- **User Profiles** - Track your contributions and favorites
- **Admin Panel** - Full CRUD operations for managing content
- **Authentication** - Secure JWT-based user authentication
- **Analytics** - Track component views and downloads
- **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

### Frontend
- React 18
- Vite (build tool)
- React Router DOM (routing)
- Tailwind CSS (styling)
- React Syntax Highlighter (code display)
- React Hot Toast (notifications)

### Backend
- Express.js (API framework)
- MariaDB (database)
- Sequelize ORM
- JWT (authentication)
- Multer (file uploads)
- bcryptjs (password hashing)

### Database
- MariaDB 10.11
- Sequelize ORM

## Project Structure

```
ui-asset-gallery/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── models/        # Sequelize models
│   │   ├── routes/       # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── utils/        # Utility functions
│   └── package.json
├── database/              # Database schema
│   └── schema.sql
├── docker-compose.yml      # Docker orchestration
└── package.json           # Root package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for containerized setup)
- OR MariaDB 10.11+ (for local setup)

### Installation

#### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd ui-asset-gallery

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
```

#### Option 2: Local Development

```bash
# Clone the repository
git clone <repository-url>
cd ui-asset-gallery

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the server directory:

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ui_gallery
DB_USER=galleryuser
DB_PASSWORD=gallerypass
JWT_SECRET=your-super-secret-key-change-in-production
```

### Running the Application

#### Backend
```bash
cd server
npm run dev
```

#### Frontend
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173` (Vite default).

## Default Admin Credentials

After initial setup, you can login with:

- **Email**: admin@ui-gallery.com
- **Password**: admin123

> ⚠️ **Security Note**: Change the default admin password immediately in production!

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Components
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/components` | List all components |
| GET | `/api/components/:id` | Get component details |
| POST | `/api/components` | Create component (admin) |
| PUT | `/api/components/:id` | Update component (admin) |
| DELETE | `/api/components/:id` | Delete component (admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create category (admin) |
| PUT | `/api/categories/:id` | Update category (admin) |
| DELETE | `/api/categories/:id` | Delete category (admin) |

### Styles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/styles` | List all styles |
| POST | `/api/styles` | Create style (admin) |
| PUT | `/api/styles/:id` | Update style (admin) |
| DELETE | `/api/styles/:id` | Delete style (admin) |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get user favorites |
| POST | `/api/favorites/:componentId` | Add to favorites |
| DELETE | `/api/favorites/:componentId` | Remove from favorites |

## Database Schema

### Users
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password` - Bcrypt hashed password
- `role` - admin/editor/viewer
- `is_active` - Account status

### Categories
- `id` - Primary key
- `name` - Category name
- `slug` - URL-friendly slug
- `description` - Category description
- `icon` - Icon identifier
- `color` - Brand color (hex)
- `parent_id` - Self-referential for hierarchy
- `sort_order` - Display order

### Styles
- `id` - Primary key
- `name` - Style name
- `slug` - URL-friendly slug
- `css_variables` - CSS custom properties
- `color_primary` - Primary brand color
- `color_secondary` - Secondary brand color

### Showcase Components
- `id` - Primary key
- `name` - Component name
- `slug` - URL-friendly slug
- `description` - Component description
- `category_id` - Foreign key to categories
- `style_id` - Foreign key to styles
- `thumbnail` - Preview image
- `demo_html` - Live demo HTML
- `is_featured` - Featured flag
- `is_premium` - Premium content flag
- `view_count` - View counter
- `download_count` - Download counter

### Variations
- `id` - Primary key
- `component_id` - Foreign key to components
- `name` - Variation name
- `html_code` - HTML implementation
- `css_code` - CSS styles
- `react_code` - React component
- `is_default` - Default variation flag

### Tags
- `id` - Primary key
- `name` - Tag name
- `slug` - URL-friendly slug
- `color` - Tag color (hex)

## User Roles

| Role | Permissions |
|------|-------------|
| **Viewer** | Browse gallery, search, view components, favorite items |
| **Editor** | All viewer permissions + create/edit components |
| **Admin** | Full access including user management and settings |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please open an issue on GitHub.

---

Built with ❤️ using React and Express.js
