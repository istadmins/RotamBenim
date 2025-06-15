/**
 * Configuration file for RotamBenim application
 * Contains Firebase configuration and application constants
 */

// Firebase Configuration
// TODO: Replace with your own Firebase project settings
const firebaseConfig = {
    apiKey: "AIzaSyB6bIJOkooeRSKWtb09zdNmMIjHDbXCzYA", 
    authDomain: "rotambenim.firebaseapp.com", 
    projectId: "rotambenim", 
    storageBucket: "rotambenim.firebasestorage.app", 
    messagingSenderId: "374285362920", 
    appId: "1:374285362920:web:b4058cf4a93e7337168b5d", 
    measurementId: "G-0QVZ4LDYPJ" 
};

// Application Configuration
const APP_CONFIG = {
    appId: firebaseConfig.appId || 'default-app-id',
    currentDataVersion: "1.7",
    maxPlaceNameLength: 100,
    maxDescriptionLength: 500,
    toastDuration: 5000,
    debounceDelay: 300,
    maxRoutePoints: 25, // Google Maps waypoint limit
    defaultMapZoom: 10,
    defaultMapCenter: { lat: 50.0755, lng: 14.4378 }, // Prague, Europe center
};

// UI Messages
const MESSAGES = {
    auth: {
        signingIn: "Signing in with Google...",
        signInSuccess: "Successfully signed in!",
        signInError: "An error occurred while signing in",
        signInCancelled: "Sign in cancelled",
        signOutSuccess: "Successfully signed out",
        signOutError: "An error occurred while signing out",
        networkError: "Network error. Please check your internet connection",
        pleaseSignIn: "Please sign in with Google"
    },
    places: {
        loading: "Loading places...",
        loadError: "Error loading places",
        addSuccess: "Place added successfully!",
        addError: "Error adding place",
        deleteSuccess: "Place deleted successfully!",
        deleteError: "Error deleting place",
        updateSuccess: "Place updated!",
        updateError: "Error updating place",
        emptyList: "No places added yet",
        noResults: "No places found matching this filter",
        confirmDelete: "Are you sure you want to delete this place?",
        nameRequired: "Please enter a place name",
        nameTooLong: `Place name can be at most ${APP_CONFIG.maxPlaceNameLength} characters`,
        alreadyExists: "This place already exists in your list"
    },
    countries: {
        loading: "Loading country information...",
        addSuccess: "Country and popular places added successfully!",
        addError: "Error adding country",
        nameRequired: "Please enter a country name",
        nameTooLong: "Country name can be at most 50 characters",
        alreadyExists: "This country already has places in your list",
        notFound: "Country not found or no popular places available"
    },
    route: {
        created: "Route created successfully!",
        minPlaces: "You need to select at least 2 places to create a route",
        maxPlaces: `You can select at most ${APP_CONFIG.maxRoutePoints} places`,
        cleared: "Selection cleared"
    },
    general: {
        error: "An error occurred",
        success: "Operation successful",
        loading: "Loading...",
        retry: "Retry",
        cancel: "Cancel",
        confirm: "Confirm"
    }
};

// Country database with popular tourist destinations
const COUNTRIES_DATABASE = {
    'turkey': {
        name: 'TURKEY',
        places: [
            { name: "Pamukkale", city: "Denizli", description: "UNESCO World Heritage site famous for its white limestone terraces and thermal springs. This unique formation has been shaped by calcium carbonate-rich thermal waters flowing for thousands of years.", category: "Nature / UNESCO / Thermal / Historical", coordinates: { lat: 37.9203, lng: 29.1206 } },
            { name: "Cappadocia", city: "Nevşehir", description: "UNESCO World Heritage area famous for fairy chimneys, underground cities and rock churches. Offers unique experiences with balloon tours, horse tours and hiking routes.", category: "Nature / UNESCO / Historical / Cultural", coordinates: { lat: 38.6431, lng: 34.8287 } },
            { name: "Ephesus Ancient City", city: "İzmir", description: "One of the best preserved ancient cities in the world and a UNESCO World Heritage site. Features the Celsus Library, Great Theatre and remains of the Temple of Artemis.", category: "Historical / UNESCO / Ancient City / Cultural", coordinates: { lat: 37.9395, lng: 27.3417 } },
            { name: "Hagia Sophia", city: "Istanbul", description: "One of the most important works of both Byzantine and Ottoman architecture. Built in 537, this magnificent structure served first as a church, then as a mosque.", category: "Historical / Architectural / Religious / UNESCO", coordinates: { lat: 41.0086, lng: 28.9802 } },
            { name: "Antalya Old Town", city: "Antalya", description: "The historic center of Antalya, featuring works from Roman, Byzantine, Seljuk and Ottoman periods. Known as the pearl of the Mediterranean with its narrow streets, historic houses, boutique hotels and restaurants.", category: "Historical / City Center / Cultural / Tourist", coordinates: { lat: 36.8841, lng: 30.7056 } },
            { name: "Topkapi Palace", city: "Istanbul", description: "Palace complex where Ottoman sultans lived from the 15th to 19th centuries. Now serves as a museum showcasing Ottoman imperial collections.", category: "Historical / Museum / Palace / UNESCO", coordinates: { lat: 41.0115, lng: 28.9833 } },
            { name: "Blue Mosque", city: "Istanbul", description: "Famous for its six minarets and blue Iznik tiles. One of Istanbul's most iconic landmarks and an active place of worship.", category: "Historical / Architectural / Religious", coordinates: { lat: 41.0054, lng: 28.9768 } },
            { name: "Mount Nemrut", city: "Adıyaman", description: "UNESCO World Heritage site featuring giant stone heads and ancient tomb sanctuary. Famous for spectacular sunrise and sunset views.", category: "Historical / UNESCO / Archaeological / Mountain", coordinates: { lat: 37.9811, lng: 38.7411 } }
        ]
    },
    'france': {
        name: 'FRANCE',
        places: [
            { name: "Eiffel Tower", city: "Paris", description: "Iconic iron lattice tower and symbol of Paris. Built in 1889, it offers spectacular views of the city from its observation decks.", category: "Landmark / Architectural / Tourist", coordinates: { lat: 48.8584, lng: 2.2945 } },
            { name: "Louvre Museum", city: "Paris", description: "World's largest art museum and historic monument. Home to thousands of works including the Mona Lisa and Venus de Milo.", category: "Museum / Art / Cultural / Historical", coordinates: { lat: 48.8606, lng: 2.3376 } },
            { name: "Palace of Versailles", city: "Versailles", description: "UNESCO World Heritage site and former royal residence. Famous for its opulent palace, magnificent gardens, and Hall of Mirrors.", category: "Historical / UNESCO / Palace / Gardens", coordinates: { lat: 48.8049, lng: 2.1204 } },
            { name: "Notre-Dame Cathedral", city: "Paris", description: "Gothic masterpiece and UNESCO World Heritage site. Famous for its flying buttresses, rose windows, and gargoyles.", category: "Historical / Religious / Architectural / UNESCO", coordinates: { lat: 48.8530, lng: 2.3499 } },
            { name: "Mont-Saint-Michel", city: "Normandy", description: "UNESCO World Heritage site featuring a medieval abbey on a tidal island. One of France's most recognizable landmarks.", category: "Historical / UNESCO / Religious / Island", coordinates: { lat: 48.6361, lng: -1.5115 } },
            { name: "Château de Chambord", city: "Loire Valley", description: "Renaissance castle in the Loire Valley, famous for its distinctive French architecture and double-helix staircase.", category: "Historical / Castle / Architectural / Renaissance", coordinates: { lat: 47.6162, lng: 1.5170 } },
            { name: "Provence Lavender Fields", city: "Provence", description: "Stunning purple lavender fields that bloom from June to August. Iconic landscape of southern France.", category: "Nature / Scenic / Agricultural / Photography", coordinates: { lat: 43.9352, lng: 5.0077 } },
            { name: "French Riviera", city: "Nice", description: "Glamorous coastline along the Mediterranean Sea. Famous for its beaches, luxury resorts, and film festival in Cannes.", category: "Coastal / Luxury / Beach / Entertainment", coordinates: { lat: 43.7102, lng: 7.2620 } }
        ]
    },
    'italy': {
        name: 'ITALY',
        places: [
            { name: "Colosseum", city: "Rome", description: "Ancient amphitheater and symbol of Imperial Rome. The largest amphitheater ever built, it hosted gladiatorial contests and public spectacles.", category: "Historical / UNESCO / Ancient / Architectural", coordinates: { lat: 41.8902, lng: 12.4922 } },
            { name: "Venice Canals", city: "Venice", description: "Unique city built on 118 small islands connected by over 400 bridges. Famous for gondola rides, St. Mark's Square, and Doge's Palace.", category: "City / UNESCO / Canals / Romantic", coordinates: { lat: 45.4408, lng: 12.3155 } },
            { name: "Leaning Tower of Pisa", city: "Pisa", description: "Famous bell tower known for its unintended tilt. Part of the cathedral complex and a UNESCO World Heritage site.", category: "Historical / UNESCO / Architectural / Landmark", coordinates: { lat: 43.7230, lng: 10.3966 } },
            { name: "Florence Cathedral", city: "Florence", description: "Gothic cathedral with iconic Renaissance dome by Brunelleschi. Dominates the skyline of Florence with its distinctive red dome.", category: "Historical / Religious / Architectural / Renaissance", coordinates: { lat: 43.7731, lng: 11.2560 } },
            { name: "Amalfi Coast", city: "Amalfi", description: "UNESCO World Heritage coastline famous for its dramatic cliffs, colorful villages, and Mediterranean beauty.", category: "Coastal / UNESCO / Scenic / Romantic", coordinates: { lat: 40.6340, lng: 14.6027 } },
            { name: "Vatican City", city: "Rome", description: "Smallest country in the world and spiritual center of Catholicism. Home to St. Peter's Basilica and the Sistine Chapel.", category: "Religious / Historical / Art / UNESCO", coordinates: { lat: 41.9029, lng: 12.4534 } },
            { name: "Cinque Terre", city: "La Spezia", description: "Five picturesque coastal villages connected by hiking trails. UNESCO World Heritage site known for colorful houses and terraced vineyards.", category: "Coastal / UNESCO / Villages / Hiking", coordinates: { lat: 44.1069, lng: 9.7295 } },
            { name: "Pompeii", city: "Naples", description: "Ancient Roman city preserved by volcanic ash from Mount Vesuvius. UNESCO World Heritage archaeological site.", category: "Historical / UNESCO / Archaeological / Ancient", coordinates: { lat: 40.7489, lng: 14.4989 } }
        ]
    },
    'spain': {
        name: 'SPAIN',
        places: [
            { name: "Sagrada Familia", city: "Barcelona", description: "Gaudí's masterpiece basilica under construction since 1882. UNESCO World Heritage site famous for its unique architectural style.", category: "Religious / Architectural / UNESCO / Modern", coordinates: { lat: 41.4036, lng: 2.1744 } },
            { name: "Alhambra", city: "Granada", description: "UNESCO World Heritage palace and fortress complex showcasing Islamic architecture. Famous for its intricate decorations and gardens.", category: "Historical / UNESCO / Islamic / Palace", coordinates: { lat: 37.1773, lng: -3.5986 } },
            { name: "Park Güell", city: "Barcelona", description: "Gaudí's colorful park featuring mosaic sculptures and unique architecture. UNESCO World Heritage site with panoramic city views.", category: "Park / Architectural / UNESCO / Art", coordinates: { lat: 41.4145, lng: 2.1527 } },
            { name: "Prado Museum", city: "Madrid", description: "One of the world's finest art museums featuring works by Velázquez, Goya, and other Spanish masters.", category: "Museum / Art / Cultural", coordinates: { lat: 40.4138, lng: -3.6921 } },
            { name: "Seville Cathedral", city: "Seville", description: "Largest Gothic cathedral in the world and UNESCO World Heritage site. Features the famous Giralda tower.", category: "Religious / Historical / UNESCO / Gothic", coordinates: { lat: 37.3860, lng: -5.9933 } },
            { name: "Camino de Santiago", city: "Santiago de Compostela", description: "Historic pilgrimage route ending at Santiago Cathedral. UNESCO World Heritage cultural route.", category: "Religious / Historical / UNESCO / Pilgrimage", coordinates: { lat: 42.8805, lng: -8.5456 } },
            { name: "Guggenheim Bilbao", city: "Bilbao", description: "Iconic modern art museum designed by Frank Gehry. Famous for its titanium-clad architecture.", category: "Museum / Modern / Architectural / Art", coordinates: { lat: 43.2687, lng: -2.9340 } }
        ]
    },
    'germany': {
        name: 'GERMANY',
        places: [
            { name: "Brandenburg Gate", city: "Berlin", description: "Iconic neoclassical monument and symbol of German reunification. Historic landmark in the heart of Berlin.", category: "Historical / Landmark / Political", coordinates: { lat: 52.5163, lng: 13.3777 } },
            { name: "Neuschwanstein Castle", city: "Bavaria", description: "Fairy-tale castle that inspired Disney's Sleeping Beauty Castle. Perched on a hilltop with stunning Alpine views.", category: "Castle / Romantic / Architectural / Tourist", coordinates: { lat: 47.5576, lng: 10.7498 } },
            { name: "Cologne Cathedral", city: "Cologne", description: "UNESCO World Heritage Gothic cathedral with twin spires. One of Germany's most visited landmarks.", category: "Religious / Historical / UNESCO / Gothic", coordinates: { lat: 50.9413, lng: 6.9583 } },
            { name: "Berlin Wall Memorial", city: "Berlin", description: "Historic site commemorating the division of Berlin. Includes preserved sections of the wall and documentation center.", category: "Historical / Memorial / Political", coordinates: { lat: 52.5351, lng: 13.3905 } },
            { name: "Oktoberfest", city: "Munich", description: "World's largest beer festival and folk festival. Annual celebration of Bavarian culture, food, and beer.", category: "Cultural / Festival / Traditional", coordinates: { lat: 48.1351, lng: 11.5820 } },
            { name: "Rhine Valley", city: "Rhine Region", description: "UNESCO World Heritage cultural landscape famous for castles, vineyards, and the Lorelei rock.", category: "Scenic / UNESCO / River / Cultural", coordinates: { lat: 50.0379, lng: 7.6203 } }
        ]
    },
    'netherlands': {
        name: 'NETHERLANDS',
        places: [
            { name: "Amsterdam Canals", city: "Amsterdam", description: "UNESCO World Heritage canal ring from the Golden Age. Features elegant canal houses, countless bridges, and picturesque waterways.", category: "City / Cultural / UNESCO / Historical", coordinates: { lat: 52.3676, lng: 4.9041 } },
            { name: "Keukenhof Gardens", city: "Lisse", description: "World's largest flower garden, especially famous for millions of tulips, daffodils, and hyacinths blooming in spring (March-May).", category: "Gardens / Nature / Flowers / Tourist", coordinates: { lat: 52.2705, lng: 4.5466 } },
            { name: "Zaanse Schans", city: "Zaandam", description: "Open-air museum showcasing traditional Dutch rural life and industrial heritage. Features historic windmills, wooden houses, and craft workshops.", category: "Village / Cultural / Historical / Tourist / Windmills", coordinates: { lat: 52.4741, lng: 4.8179 } },
            { name: "Giethoorn", city: "Giethoorn", description: "Known as 'Venice of the North', this car-free village features canals, wooden bridges, and thatched-roof houses.", category: "Village / Canals / Unique / Picturesque", coordinates: { lat: 52.7386, lng: 6.0783 } },
            { name: "Rijksmuseum", city: "Amsterdam", description: "National museum featuring Dutch art and history, including works by Rembrandt and Vermeer.", category: "Museum / Art / Cultural / Historical", coordinates: { lat: 52.3600, lng: 4.8852 } }
        ]
    },
    'japan': {
        name: 'JAPAN',
        places: [
            { name: "Mount Fuji", city: "Honshu", description: "Japan's highest mountain and sacred symbol. UNESCO World Heritage site famous for its perfect cone shape and cultural significance.", category: "Mountain / UNESCO / Sacred / Nature", coordinates: { lat: 35.3606, lng: 138.7274 } },
            { name: "Fushimi Inari Shrine", city: "Kyoto", description: "Famous Shinto shrine with thousands of vermillion torii gates creating tunnels up the mountainside.", category: "Religious / Cultural / Shrine / Hiking", coordinates: { lat: 34.9671, lng: 135.7727 } },
            { name: "Tokyo Skytree", city: "Tokyo", description: "World's second tallest structure offering panoramic views of Tokyo. Modern broadcasting tower and tourist attraction.", category: "Modern / Landmark / Views / Tourist", coordinates: { lat: 35.7101, lng: 139.8107 } },
            { name: "Kinkaku-ji Temple", city: "Kyoto", description: "Golden Pavilion covered in gold leaf, reflected in surrounding pond. UNESCO World Heritage site and Zen temple.", category: "Religious / UNESCO / Temple / Golden", coordinates: { lat: 35.0394, lng: 135.7292 } },
            { name: "Hiroshima Peace Memorial", city: "Hiroshima", description: "UNESCO World Heritage site commemorating atomic bomb victims. Includes Peace Memorial Park and Museum.", category: "Memorial / UNESCO / Historical / Peace", coordinates: { lat: 34.3955, lng: 132.4536 } },
            { name: "Arashiyama Bamboo Grove", city: "Kyoto", description: "Enchanting bamboo forest creating natural green tunnels. Popular walking path with ethereal lighting.", category: "Nature / Forest / Scenic / Walking", coordinates: { lat: 35.0170, lng: 135.6761 } },
            { name: "Senso-ji Temple", city: "Tokyo", description: "Tokyo's oldest temple founded in 628 AD. Famous for its Thunder Gate and traditional shopping street Nakamise-dori.", category: "Religious / Historical / Temple / Traditional", coordinates: { lat: 35.7148, lng: 139.7967 } }
        ]
    },
    'greece': {
        name: 'GREECE',
        places: [
            { name: "Acropolis of Athens", city: "Athens", description: "UNESCO World Heritage site featuring the Parthenon and other ancient Greek temples. Symbol of classical civilization and democracy.", category: "Historical / UNESCO / Ancient / Archaeological", coordinates: { lat: 37.9715, lng: 23.7267 } },
            { name: "Santorini", city: "Santorini", description: "Volcanic island famous for white-washed buildings, blue domes, and spectacular sunsets over the Aegean Sea.", category: "Island / Volcanic / Scenic / Romantic", coordinates: { lat: 36.3932, lng: 25.4615 } },
            { name: "Mykonos", city: "Mykonos", description: "Cosmopolitan island known for its vibrant nightlife, beautiful beaches, and traditional Cycladic architecture.", category: "Island / Beach / Nightlife / Traditional", coordinates: { lat: 37.4467, lng: 25.3289 } },
            { name: "Delphi", city: "Delphi", description: "UNESCO World Heritage archaeological site, ancient sanctuary of Apollo and home to the famous Oracle.", category: "Historical / UNESCO / Ancient / Religious", coordinates: { lat: 38.4824, lng: 22.5009 } },
            { name: "Meteora", city: "Kalambaka", description: "UNESCO World Heritage site featuring monasteries built on top of towering rock pillars. Unique geological and spiritual landscape.", category: "Religious / UNESCO / Geological / Monasteries", coordinates: { lat: 39.7153, lng: 21.6301 } },
            { name: "Rhodes Old Town", city: "Rhodes", description: "UNESCO World Heritage medieval city with well-preserved walls, cobblestone streets, and Palace of the Grand Masters.", category: "Historical / UNESCO / Medieval / Island", coordinates: { lat: 36.4467, lng: 28.2278 } }
        ]
    }
};

// Initial places data for new users
const INITIAL_PLACES_DATA = [
    // TURKEY
    { 
        userGivenId: 'tr_001', 
        country: "TURKEY", 
        name: "Pamukkale", 
        city: "Denizli", 
        description: "UNESCO World Heritage site famous for its white limestone terraces and thermal springs. This unique formation has been shaped by calcium carbonate-rich thermal waters flowing for thousands of years.", 
        category: "Nature / UNESCO / Thermal / Historical", 
        visited: false, 
        mapQuery: "Pamukkale, Denizli", 
        selectedForRoute: false,
        coordinates: { lat: 37.9203, lng: 29.1206 }
    },
    // NETHERLANDS
    { 
        userGivenId: 'nl_001', 
        country: "NETHERLANDS", 
        name: "Amsterdam Canals", 
        city: "Amsterdam", 
        description: "UNESCO World Heritage canal ring from the Golden Age. Features elegant canal houses, countless bridges, and picturesque waterways.", 
        category: "City / Cultural / UNESCO / Historical", 
        visited: false, 
        mapQuery: "Amsterdam Canals", 
        selectedForRoute: false,
        coordinates: { lat: 52.3676, lng: 4.9041 }
    },
    { 
        userGivenId: 'nl_002', 
        country: "NETHERLANDS", 
        name: "Keukenhof Gardens", 
        city: "Lisse", 
        description: "World's largest flower garden, especially famous for millions of tulips, daffodils, and hyacinths blooming in spring (March-May).", 
        category: "Gardens / Nature / Flowers / Tourist", 
        visited: false, 
        mapQuery: "Keukenhof, Lisse", 
        selectedForRoute: false,
        coordinates: { lat: 52.2705, lng: 4.5466 }
    },

    // ITALY
    { 
        userGivenId: 'it_001', 
        country: "ITALY", 
        name: "Colosseum", 
        city: "Rome", 
        description: "Ancient amphitheater and symbol of Imperial Rome. The largest amphitheater ever built, it hosted gladiatorial contests and public spectacles.", 
        category: "Historical / UNESCO / Ancient / Architectural", 
        visited: false, 
        mapQuery: "Colosseum, Rome", 
        selectedForRoute: false,
        coordinates: { lat: 41.8902, lng: 12.4922 }
    },
    { 
        userGivenId: 'it_002', 
        country: "ITALY", 
        name: "Venice Canals", 
        city: "Venice", 
        description: "Unique city built on 118 small islands connected by over 400 bridges. Famous for gondola rides, St. Mark's Square, and Doge's Palace.", 
        category: "City / UNESCO / Canals / Romantic", 
        visited: false, 
        mapQuery: "Venice Canals", 
        selectedForRoute: false,
        coordinates: { lat: 45.4408, lng: 12.3155 }
    }
];

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, APP_CONFIG, MESSAGES, INITIAL_PLACES_DATA, COUNTRIES_DATABASE };
}