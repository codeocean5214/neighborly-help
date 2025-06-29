# NeighborlyHelp - Community Assistance Platform

A modern web application that connects local residents to give and receive help within their community. Built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

### Core Functionality
- **Community Help Requests** - Post and respond to assistance requests
- **Real-time Map View** - Visualize help requests in your area
- **Multi-language Support** - Automatic translation for diverse communities
- **Secure Payments** - Stripe integration for paid services and donations
- **User Verification** - Google OAuth authentication with profile verification

### Categories
- 🎓 **Education** - Tutoring and learning assistance
- 🛒 **Errands** - Shopping, delivery, and daily tasks
- 🎁 **Donations** - Item sharing and charitable giving
- 🔧 **Skills/Services** - Professional and technical help
- ❤️ **Elder Care** - Support for elderly community members

### Payment Options
- **Free Help** - Traditional community assistance
- **Paid Services** - Professional services with secure payment
- **Donations** - Optional tips and contributions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Google Cloud Console account (for OAuth)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd neighborly-help
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google Identity Services API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
   - Copy the Client ID to your `.env` file:
     ```
     VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
     ```

5. **Configure Stripe (Optional)**
   - Create a [Stripe account](https://dashboard.stripe.com/register)
   - Get your publishable key from the dashboard
   - Add to your `.env` file:
     ```
     VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
     ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Google OAuth Setup

1. **Create Google Cloud Project**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable "Google Identity Services API"

2. **Configure OAuth Consent Screen**
   - Go to "OAuth consent screen"
   - Fill in application details
   - Add your domain to authorized domains

3. **Create OAuth Credentials**
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - Your production domain
   - Copy the Client ID

4. **Update Environment Variables**
   ```bash
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

### Stripe Payment Setup

1. **Create Stripe Account**
   - Sign up at [stripe.com](https://stripe.com)
   - Complete account verification

2. **Get API Keys**
   - Go to Developers → API Keys
   - Copy your publishable key (starts with `pk_`)
   - For production, use live keys

3. **Update Environment Variables**
   ```bash
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   ```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Maps**: Leaflet with React-Leaflet
- **Authentication**: Google OAuth 2.0
- **Payments**: Stripe Elements
- **Icons**: Lucide React
- **Build Tool**: Vite

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── data/              # Mock data and constants
├── types/             # TypeScript type definitions
└── main.tsx           # Application entry point
```

### Key Components
- **AuthModal** - Google OAuth sign-in interface
- **HelpRequestCard** - Individual request display
- **MapView** - Interactive map with request markers
- **PaymentModal** - Stripe payment processing
- **CreateRequestForm** - Multi-step request creation

## 🌍 Multi-language Support

The application includes built-in translation capabilities:

- **Automatic Detection** - Detects user's browser language
- **12 Languages Supported** - English, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Korean, Arabic, Hindi
- **Real-time Translation** - Translates request content on demand
- **Language Selector** - Easy switching between languages

## 💳 Payment Integration

### Supported Payment Types
- **Service Payments** - Direct payment for professional services
- **Donations** - Optional contributions to helpers
- **Tips** - Appreciation payments after service completion

### Security Features
- PCI-compliant payment processing
- No card data stored locally
- Stripe-secured transactions
- Real-time payment confirmation

## 🗺️ Map Features

- **Interactive Map** - Leaflet-powered map interface
- **Request Markers** - Color-coded by category
- **Popup Details** - Quick request information
- **Auto-fitting Bounds** - Automatically centers on requests
- **Category Legend** - Visual guide to marker types

## 🔒 Security & Privacy

- **OAuth Authentication** - Secure Google sign-in
- **Email Verification** - Verified user accounts
- **Privacy Controls** - User data protection
- **Secure Payments** - Stripe encryption
- **Local Storage** - Minimal data persistence

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```bash
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_key
```

### Deployment Checklist
- [ ] Update Google OAuth authorized origins
- [ ] Switch to Stripe live keys
- [ ] Configure production domain
- [ ] Set up SSL certificate
- [ ] Test all authentication flows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For setup help or questions:
1. Check the environment variable configuration
2. Verify Google OAuth setup
3. Test with demo mode first
4. Review browser console for errors

## 🎯 Demo Mode

The application includes a demo mode that works without API keys:
- Click "Continue with Google (Demo)" to test
- Creates a mock user account
- All features work except real payments
- Perfect for development and testing