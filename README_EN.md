# RotamBenim - European Travel Planner

RotamBenim is a modern web application that helps you discover places to visit in Europe, create your personal list, and plan your travel routes.

## 🌟 Features

### 🔐 Authentication
- Secure login with Google account
- Personal data synchronization
- Multi-device support

### 📍 Place Management
- Pre-defined European destinations
- Add new places feature
- Delete and edit places
- Visit status tracking
- Category-based filtering

### 🗺️ Map Integration
- Google Maps integration
- Display selected places on map
- Coordinate-based location support

### 🛣️ Route Planning
- Multi-place selection
- Sequential route creation
- Automatic Google Maps redirection
- Share route links

### 🎨 Modern User Interface
- Responsive design
- Modern appearance with Tailwind CSS
- Accessibility support
- Toast notifications
- Loading states

### 🔧 Technical Features
- Modular JavaScript architecture
- Firebase Firestore database
- Real-time data synchronization
- Error handling and logging
- Performance monitoring

## 🚀 Installation

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project
- Internet connection

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable Authentication:
   - Authentication > Sign-in method
   - Enable Google
4. Enable Firestore Database:
   - Firestore Database > Create database
   - Start in test mode
5. Enable Hosting (optional)
6. Get config information from project settings

### Configuration

Update Firebase configuration in `public/js/config.js`:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
```

### Firestore Indexes

Create the following composite index:
- Collection: `places`
- Fields: `country` (Ascending), `name` (Ascending)

You can add this from Firebase Console > Firestore Database > Indexes section.

### Local Development

```bash
# Firebase CLI installation (optional)
npm install -g firebase-tools

# Clone the project
git clone <repository-url>
cd RotamBenim

# Login to Firebase
firebase login

# Start local server
firebase serve
```

Alternatively, you can use any HTTP server:

```bash
# With Python
python -m http.server 8000

# With Node.js
npx http-server

# With PHP
php -S localhost:8000
```

## 📁 Project Structure

```
RotamBenim/
├── public/
│   ├── index.html              # Main HTML file
│   ├── styles.css              # CSS styles
│   └── js/
│       ├── config.js           # Configuration and constants
│       ├── utils.js            # Utility functions
│       ├── firebase-service.js # Firebase services
│       ├── ui-components.js    # UI components
│       ├── place-manager.js    # Place management
│       ├── route-manager.js    # Route management
│       └── app.js              # Main application
├── firebase.json               # Firebase configuration
└── README.md                   # This file
```

## 🏗️ Architecture

### Modular Structure
The application consists of independent modules:

- **Config**: Configuration and constants
- **Utils**: General utility functions
- **FirebaseService**: Firebase operations
- **UIComponents**: User interface components
- **PlaceManager**: Place management operations
- **RouteManager**: Route planning operations
- **App**: Main application coordinator

### Data Flow
1. User signs in with Google
2. Firebase Authentication validates user
3. User-specific data loads from Firestore
4. Real-time listeners track data changes
5. UI updates automatically

### Security
- Data protection with Firebase Security Rules
- User-based data isolation
- HTML sanitization for XSS protection
- HTTPS requirement

## 🎯 Usage

### Signing In
1. Click "Sign in with Google" button
2. Select your Google account
3. Approve permissions

### Adding Places
1. Type place name in "Add New Place" section
2. Click "Add Place" button
3. Place automatically adds to your list with detailed information

### Creating Routes
1. Click on places from the list you want to add to route
2. Selected places are marked in blue
3. After selecting at least 2 places, "Create Route" button becomes active
4. Click the button to create Google Maps route

### Filtering
- Use country filter to view places in specific countries
- Use visit status filter to separate visited/unvisited places

## 🔧 Development

### Code Standards
- ES6+ JavaScript usage
- Modular architecture
- JSDoc documentation
- Error handling
- Accessibility support

### Adding New Features

1. **Creating New Module**:
```javascript
class NewModule {
    constructor() {
        this.isInitialized = false;
    }
    
    initialize() {
        // Initialization logic
        this.isInitialized = true;
    }
    
    cleanup() {
        // Cleanup logic
    }
}

window.newModule = new NewModule();
```

2. **Integration to Main App**:
```javascript
// In app.js
this.modules.newModule = window.newModule;
this.modules.newModule.initialize();
```

### Debugging
- Use Browser Developer Tools
- Check console logs
- Monitor Firebase requests in Network tab
- Check localStorage/sessionStorage in Application tab

## 🚀 Deployment

### Firebase Hosting
```bash
# Build (if build process exists)
npm run build

# Deploy
firebase deploy
```

### Other Hosting Services
- Netlify
- Vercel
- GitHub Pages
- Heroku

You can upload static files to any web server.

## 🐛 Troubleshooting

### Common Issues

**Firebase connection error**:
- Check config information
- Ensure API key is correct
- Verify Firebase project is active

**Firestore index error**:
- Create required indexes from Firebase Console
- Click the link in error message for automatic creation

**Google Sign-In not working**:
- Check Authorized domains list
- Ensure you're using HTTPS (except localhost)

**Data not loading**:
- Check requests in Network tab
- Verify Firestore Security Rules
- Ensure user has correct permissions

### Log Checking
```javascript
// In browser console
console.log(rotamBenimApp.getApplicationState());
console.log(firebaseService.getCurrentUser());
console.log(placeManager.getPlaces());
```

## 📈 Performance

### Optimization Tips
- Use lazy loading
- Optimize images
- Minimize bundle size
- Implement caching strategies
- Use CDN

### Monitoring
- Firebase Performance Monitoring
- Google Analytics
- Custom performance metrics

## 🔒 Security

### Best Practices
- Use Firebase Security Rules
- Keep API keys secure
- Enforce HTTPS
- Implement input validation
- Apply XSS protection

### Security Rules Example
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License. See `LICENSE` file for details.

## 📞 Contact

- GitHub Issues: Report issues
- Email: [your-email@example.com]
- Website: [your-website.com]

## 🙏 Acknowledgments

- Firebase team for amazing backend services
- Tailwind CSS team for modern CSS framework
- Google Maps team for map services
- Open source community for contributions

---

**Discover Europe with RotamBenim!** 🌍✈️

## 🆕 Latest Features

### Smart Place Addition
- **Automatic Information Retrieval**: When you add a place like "Pamukkale", the system automatically:
  - Finds detailed information about the place
  - Determines the correct country (Turkey)
  - Adds appropriate category (Nature/UNESCO/Thermal/Historical)
  - Includes GPS coordinates
  - Generates descriptive text

### Supported APIs
- **Nominatim (OpenStreetMap)**: Primary geocoding service
- **Wikipedia API**: Additional information and descriptions
- **Fallback System**: If one API fails, another takes over

### Turkish Places Database
Pre-defined information for famous Turkish destinations:
- Pamukkale (Denizli)
- Cappadocia (Nevşehir)
- Ephesus Ancient City (İzmir)
- Hagia Sophia (Istanbul)
- Antalya Old Town (Kaleiçi)
- And many more...

### Enhanced User Experience
- Real-time feedback during place addition
- Automatic country categorization
- Duplicate prevention
- Smart category assignment
- Coordinate-based map integration