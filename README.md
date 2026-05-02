# HavenHive Frontend

A professional, feature-complete real estate marketplace frontend built with Next.js, TypeScript, and TailwindCSS. Seamlessly connects to the HavenHive backend API.

## Features

### User Authentication

- User registration with email verification
- Secure login with JWT tokens
- Password reset flow
- Role-based access (User, Agent, Admin)
- Protected routes and pages

### Property Browsing

- Advanced property search and filtering
- Property detail pages with images
- Property reviews and ratings system
- Wishlist management
- Featured properties showcase

### Booking System

- Schedule property visits or calls
- View booking history
- Manage booking status

### User Dashboard

- Profile management
- Booking history and status
- Email verification status
- Account statistics

### Property Management (Agents)

- Create new property listings
- Upload multiple property images
- Edit and manage properties
- View property performance

### Admin Dashboard

- User management
- Property moderation
- Booking oversight
- Contact message handling

### Blog Section

- Read published blog posts
- Filter by categories
- View author information

### Contact Form

- Send inquiries directly
- Track contact status
- Responsive contact handling

## Tech Stack

- **Framework:** Next.js 14+ (React 18)
- **Language:** TypeScript
- **Styling:** TailwindCSS with custom components
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form with Zod validation
- **Icons:** Lucide React
- **Date Utils:** date-fns
- **Authentication:** JWT with cookies
- **Development:** ESLint, TypeScript strict mode

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd HavenHive-Frontend
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Frontend base URL (for Vercel)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                      # Next.js app directory (pages & routing)
│   ├── auth/                # Authentication pages (login, register, etc.)
│   ├── properties/          # Property listing & detail pages
│   ├── admin/               # Admin dashboard
│   ├── dashboard/           # User dashboard
│   ├── profile/             # User profile
│   ├── contact/             # Contact form
│   ├── blogs/               # Blog pages
│   ├── layout.tsx           # Root layout with Navbar
│   └── page.tsx             # Home page
├── components/              # Reusable React components
│   ├── ui/                 # UI components (Button, Input, Card, etc.)
│   ├── auth/               # Auth components (LoginForm, RegisterForm)
│   └── property/           # Property-specific components
├── lib/                     # Utilities and services
│   ├── api-client.ts       # Axios instance with interceptors
│   ├── utils.ts            # Helper functions
│   └── services/           # API service functions
│       ├── auth.ts
│       ├── property.ts
│       ├── booking.ts
│       ├── review.ts
│       ├── user.ts
│       ├── blog.ts
│       └── contact.ts
├── hooks/                   # Custom React hooks (future)
├── store/                   # Zustand state management
│   └── auth.ts             # Auth store
├── types/                   # TypeScript type definitions
│   └── index.ts            # All API and entity types
└── styles/                  # Global styles
    └── globals.css         # Tailwind CSS & global styles
```

## Pages & Routes

### Public Routes

- `/` - Home page with featured properties
- `/properties` - All properties with filters
- `/properties/[id]` - Property details
- `/blogs` - Blog list
- `/contact` - Contact form
- `/auth/login` - Login page
- `/auth/register` - Sign up page
- `/auth/forgot-password` - Password reset request

### Protected Routes (Authentication Required)

- `/profile` - User profile management
- `/dashboard` - User dashboard with bookings
- `/admin` - Admin dashboard (admin only)
- `/agent/properties` - Agent property management (agent/admin only)

## API Integration

The frontend communicates with the backend API using Axios. All API calls are defined in `src/lib/services/`:

### Auth Service

```typescript
authService.register(payload);
authService.login(payload);
authService.getMe();
authService.logout();
authService.forgotPassword(email);
authService.resetPassword(token, password);
authService.verifyEmail(token);
authService.requestEmailVerification();
```

### Property Service

```typescript
propertyService.getAll(params);
propertyService.getById(id);
propertyService.create(formData);
propertyService.update(id, formData);
propertyService.delete(id);
propertyService.getFeatured();
propertyService.getStats();
```

### Other Services

- `bookingService` - Booking CRUD operations
- `reviewService` - Property reviews
- `userService` - User management
- `blogService` - Blog posts
- `contactService` - Contact messages

## Authentication Flow

1. **Login/Register:** User credentials sent to backend
2. **JWT Token:** Backend returns JWT token
3. **Token Storage:** Token saved in cookies via `js-cookie`
4. **Token Injection:** Axios interceptor adds token to all requests
5. **Token Refresh:** On 401 response, token cleared and user redirected to login
6. **User State:** Zustand store maintains user state across pages

## Styling

The project uses **TailwindCSS** for styling with custom theme configuration:

### Color Palette

```
- Primary: #3b82f6 (Blue)
- Secondary: #10b981 (Green)
- Accent: #f59e0b (Amber)
- Danger: #ef4444 (Red)
- Dark: #1f2937 (Gray-800)
- Light: #f9fafb (Gray-50)
```

### Component System

All reusable UI components are in `src/components/ui/`:

- Button - with variants (primary, secondary, danger, outline)
- Input - with labels and error messages
- Card - for content containers
- Alert - for notifications
- Rating - for product/property ratings
- LoadingSpinner - for loading states
- Navbar - navigation component

## State Management

**Zustand** is used for simple, lightweight state management:

### Auth Store

```typescript
const { user, isLoading, error, setUser, logout, checkAuth } = useAuthStore();
```

The auth store persists user data in localStorage and manages authentication state globally.

## Forms & Validation

Forms use **React Hook Form** with **Zod** for validation. Example:

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(schema),
});
```

## Development Guidelines

### Adding a New Page

1. Create folder in `src/app/[feature]/`
2. Add `page.tsx` component
3. Use `"use client"` directive for interactive pages
4. Import and use components from `src/components/`

### Adding a New Component

1. Create `.tsx` file in `src/components/ui/` or feature folder
2. Add `"use client"` for interactive components
3. Export default component
4. Add proper TypeScript typing

### Adding a New API Service

1. Create service file in `src/lib/services/`
2. Use `apiClient` for HTTP requests
3. Return typed responses using `ApiResponse<T>`
4. Export service object with methods

## Environment Variables

| Variable               | Default                 | Description                    |
| ---------------------- | ----------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:5000` | Backend API URL                |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Frontend base URL (for Vercel) |

## Production Build

```bash
npm run build
npm start
```

This creates an optimized production build in the `.next` directory.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Framework: **Next.js**
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL` = Your backend API URL (Vercel-deployed backend)
   - `NEXT_PUBLIC_BASE_URL` = Your Vercel domain
5. Deploy!

### Docker

```bash
docker build -t havenhive-frontend .
docker run -p 3000:3000 havenhive-frontend
```

### Traditional Server

```bash
npm install
npm run build
npm start
```

Then use PM2 or systemd to manage the process.

## Troubleshooting

### API Connection Issues

- Check `NEXT_PUBLIC_API_URL` points to correct backend
- Ensure backend CORS allows your frontend domain
- Verify backend is running

### Login Not Working

- Ensure token is being saved in cookies
- Check browser DevTools > Application > Cookies
- Verify backend auth endpoints are working

### Styling Issues

- Run `npm run build` to ensure Tailwind processes all files
- Clear `.next` directory: `rm -rf .next`
- Restart dev server: `npm run dev`

### TypeScript Errors

- Run `npm run type-check` to see all type errors
- Ensure all API responses are properly typed
- Check imports use correct paths

## Performance Optimization

- **Image Optimization:** Next.js Image component for responsive images
- **Code Splitting:** Automatic chunking with Next.js
- **Caching:** Browser caching headers configured
- **Minification:** Automatic with production builds
- **Tree Shaking:** Unused code removed automatically

## Security

- **HTTPS Enforced:** Required for Vercel deployments
- **JWT Tokens:** Secure token-based authentication
- **CORS:** Configured on backend for specific domains
- **XSS Protection:** React's built-in XSS protection
- **CSRF Protection:** Cookies configured with SameSite
- **Input Validation:** Zod schemas for all forms

## Contributing

1. Create a feature branch
2. Make changes
3. Run `npm run lint` to check code quality
4. Submit a pull request

## Support

For issues or questions, contact the development team or open an issue on GitHub.

## License

Private - HavenHive Project
