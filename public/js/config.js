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

const pexelsApiKey = 'qLDLKWTXLouQCKT40OyIA982lb5kv0ftITaaLYbaOrx2FKNbGf5sZlYF';

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
        name: 'TÜRKİYE',
        places: [
            { name: "Pamukkale", city: "Denizli", description: "Pamukkale, Denizli ili sınırları içerisinde yer alan ve UNESCO Dünya Mirası Listesi'nde bulunan doğal bir harikadır. Beyaz kireç taraçaları ve termal suları ile ünlü olan bu eşsiz oluşum, binlerce yıldır akan kalsiyum karbonat açısından zengin termal sularla şekillenmiştir. Antik Hierapolis şehri kalıntıları da bu bölgede yer almaktadır. Ziyaretçiler hem doğal güzellikleri hem de tarihi kalıntıları aynı anda keşfedebilirler.", category: "Doğa / UNESCO / Termal / Tarihi", coordinates: { lat: 37.9203, lng: 29.1206 } },
            { name: "Kapadokya", city: "Nevşehir", description: "Kapadokya, peri bacaları, yeraltı şehirleri ve kaya kiliselerle ünlü UNESCO Dünya Mirası alanıdır. Volkanik faaliyetler sonucu oluşan bu eşsiz coğrafya, binlerce yıllık doğal aşınma ile bugünkü şeklini almıştır. Balon turları, at turları ve yürüyüş rotalarıyla ziyaretçilerine unutulmaz deneyimler sunar. Göreme Açık Hava Müzesi ve Derinkuyu Yeraltı Şehri en popüler ziyaret noktalarıdır.", category: "Doğa / UNESCO / Tarihi / Kültürel", coordinates: { lat: 38.6431, lng: 34.8287 } },
            { name: "Efes Antik Kenti", city: "İzmir", description: "Efes, İzmir'in Selçuk ilçesinde bulunan ve dünyanın en iyi korunmuş antik kentlerinden biri olan UNESCO Dünya Mirası alanıdır. Roma İmparatorluğu döneminde Anadolu'nun en önemli ticaret merkezlerinden biriydi. Celsus Kütüphanesi, Büyük Tiyatro ve Artemis Tapınağı kalıntıları en dikkat çekici yapılardır. Antik dönemde 250.000 kişinin yaşadığı bu kent, günümüzde milyonlarca turist tarafından ziyaret edilmektedir.", category: "Tarihi / UNESCO / Antik Kent / Kültürel", coordinates: { lat: 37.9395, lng: 27.3417 } },
            { name: "Ayasofya", city: "İstanbul", description: "Ayasofya, İstanbul'da bulunan ve hem Bizans hem de Osmanlı mimarisinin en önemli eserlerinden biri olan tarihi yapıdır. 537 yılında inşa edilen bu muhteşem yapı, önce kilise, sonra cami olarak hizmet vermiştir. Dev kubbesi ve iç mekanındaki mozaikler mimari açıdan büyük önem taşır. UNESCO Dünya Mirası Listesi'nde yer alan yapı, İstanbul'un en çok ziyaret edilen turistik mekanlarından biridir.", category: "Tarihi / Mimari / Dini / UNESCO", coordinates: { lat: 41.0086, lng: 28.9802 } },
            { name: "Antalya Kaleiçi", city: "Antalya", description: "Kaleiçi, Antalya'nın tarihi merkezi olup, Roma, Bizans, Selçuklu ve Osmanlı dönemlerinden kalma eserlerin bir arada bulunduğu büyüleyici bir bölgedir. Dar sokakları, tarihi evleri, butik otelleri ve restoranlarıyla Akdeniz'in incisi olarak bilinir. Hadrian Kapısı, Yivli Minare ve Kesik Minare gibi tarihi yapılar bölgenin önemli simgeleridir. Marina ve eski liman çevresi, gece hayatı ve yeme-içme mekanlarıyla da ünlüdür.", category: "Tarihi / Şehir Merkezi / Kültürel / Turistik", coordinates: { lat: 36.8841, lng: 30.7056 } },
            { name: "Topkapı Sarayı", city: "İstanbul", description: "Topkapı Sarayı, 15. yüzyıldan 19. yüzyıla kadar Osmanlı padişahlarının yaşadığı saray kompleksidir. Dört avludan oluşan saray, günümüzde müze olarak hizmet vermekte ve Osmanlı İmparatorluğu'nun zengin koleksiyonlarını sergilemektedir. Harem daireleri, Kutsal Emanetler bölümü ve hazine dairesi en çok ilgi gören bölümlerdir. Boğaz manzarası ve tarihi atmosferiyle İstanbul'un vazgeçilmez durağıdır.", category: "Tarihi / Müze / Saray / UNESCO", coordinates: { lat: 41.0115, lng: 28.9833 } },
            { name: "Sultan Ahmet Camii", city: "İstanbul", description: "Sultan Ahmet Camii, altı minaresi ve mavi İznik çinileriyle ünlü olup, İstanbul'un en ikonik simgelerinden biridir. 17. yüzyılda inşa edilen cami, Osmanlı mimarisinin en güzel örneklerinden biri olarak kabul edilir. İç mekanındaki 20.000'den fazla el yapımı çini, ziyaretçileri büyüler. Ayasofya'nın karşısında yer alan cami, hala aktif olarak ibadete açıktır.", category: "Tarihi / Mimari / Dini", coordinates: { lat: 41.0054, lng: 28.9768 } },
            { name: "Nemrut Dağı", city: "Adıyaman", description: "Nemrut Dağı, dev taş başları ve antik mezar kutsal alanıyla ünlü UNESCO Dünya Mirası alanıdır. Kommagene Krallığı döneminden kalma bu eşsiz anıt, 2134 metre yükseklikte yer alır. Gündoğumu ve günbatımı manzaraları nefes kesici güzellikte olup, fotoğraf tutkunları için cennet gibidir. Antilokhos'un mezar tümülüsü ve heykelleri, antik dönemin sanat anlayışını yansıtan önemli eserlerdir.", category: "Tarihi / UNESCO / Arkeolojik / Dağ", coordinates: { lat: 37.9811, lng: 38.7411 } },
            { name: "Sümela Manastırı", city: "Trabzon", description: "Sümela Manastırı, Trabzon'un Maçka ilçesinde Altındere Vadisi'nde yer alan ve kayalara oyulmuş Bizans dönemi manastırıdır. 4. yüzyılda kurulan manastır, Karadeniz'in en önemli tarihi ve dini yapılarından biridir. 300 metre yükseklikteki kayalık yamaca inşa edilen yapı, hem mimari hem de doğal güzellikleriyle büyüler. Freskleri ve ikonaları ile Ortodoks sanatının en güzel örneklerini barındırır.", category: "Tarihi / Dini / Bizans / Doğa", coordinates: { lat: 40.6911, lng: 39.6637 } }
        ]
    },
    'türkiye': {
        name: 'TÜRKİYE',
        places: [
            { name: "Pamukkale", city: "Denizli", description: "Pamukkale, Denizli ili sınırları içerisinde yer alan ve UNESCO Dünya Mirası Listesi'nde bulunan doğal bir harikadır. Beyaz kireç taraçaları ve termal suları ile ünlü olan bu eşsiz oluşum, binlerce yıldır akan kalsiyum karbonat açısından zengin termal sularla şekillenmiştir. Antik Hierapolis şehri kalıntıları da bu bölgede yer almaktadır. Ziyaretçiler hem doğal güzellikleri hem de tarihi kalıntıları aynı anda keşfedebilirler.", category: "Doğa / UNESCO / Termal / Tarihi", coordinates: { lat: 37.9203, lng: 29.1206 } },
            { name: "Kapadokya", city: "Nevşehir", description: "Kapadokya, peri bacaları, yeraltı şehirleri ve kaya kiliselerle ünlü UNESCO Dünya Mirası alanıdır. Volkanik faaliyetler sonucu oluşan bu eşsiz coğrafya, binlerce yıllık doğal aşınma ile bugünkü şeklini almıştır. Balon turları, at turları ve yürüyüş rotalarıyla ziyaretçilerine unutulmaz deneyimler sunar. Göreme Açık Hava Müzesi ve Derinkuyu Yeraltı Şehri en popüler ziyaret noktalarıdır.", category: "Doğa / UNESCO / Tarihi / Kültürel", coordinates: { lat: 38.6431, lng: 34.8287 } },
            { name: "Efes Antik Kenti", city: "İzmir", description: "Efes, İzmir'in Selçuk ilçesinde bulunan ve dünyanın en iyi korunmuş antik kentlerinden biri olan UNESCO Dünya Mirası alanıdır. Roma İmparatorluğu döneminde Anadolu'nun en önemli ticaret merkezlerinden biriydi. Celsus Kütüphanesi, Büyük Tiyatro ve Artemis Tapınağı kalıntıları en dikkat çekici yapılardır. Antik dönemde 250.000 kişinin yaşadığı bu kent, günümüzde milyonlarca turist tarafından ziyaret edilmektedir.", category: "Tarihi / UNESCO / Antik Kent / Kültürel", coordinates: { lat: 37.9395, lng: 27.3417 } },
            { name: "Ayasofya", city: "İstanbul", description: "Ayasofya, İstanbul'da bulunan ve hem Bizans hem de Osmanlı mimarisinin en önemli eserlerinden biri olan tarihi yapıdır. 537 yılında inşa edilen bu muhteşem yapı, önce kilise, sonra cami olarak hizmet vermiştir. Dev kubbesi ve iç mekanındaki mozaikler mimari açıdan büyük önem taşır. UNESCO Dünya Mirası Listesi'nde yer alan yapı, İstanbul'un en çok ziyaret edilen turistik mekanlarından biridir.", category: "Tarihi / Mimari / Dini / UNESCO", coordinates: { lat: 41.0086, lng: 28.9802 } },
            { name: "Antalya Kaleiçi", city: "Antalya", description: "Kaleiçi, Antalya'nın tarihi merkezi olup, Roma, Bizans, Selçuklu ve Osmanlı dönemlerinden kalma eserlerin bir arada bulunduğu büyüleyici bir bölgedir. Dar sokakları, tarihi evleri, butik otelleri ve restoranlarıyla Akdeniz'in incisi olarak bilinir. Hadrian Kapısı, Yivli Minare ve Kesik Minare gibi tarihi yapılar bölgenin önemli simgeleridir. Marina ve eski liman çevresi, gece hayatı ve yeme-içme mekanlarıyla da ünlüdür.", category: "Tarihi / Şehir Merkezi / Kültürel / Turistik", coordinates: { lat: 36.8841, lng: 30.7056 } },
            { name: "Topkapı Sarayı", city: "İstanbul", description: "Topkapı Sarayı, 15. yüzyıldan 19. yüzyıla kadar Osmanlı padişahlarının yaşadığı saray kompleksidir. Dört avludan oluşan saray, günümüzde müze olarak hizmet vermekte ve Osmanlı İmparatorluğu'nun zengin koleksiyonlarını sergilemektedir. Harem daireleri, Kutsal Emanetler bölümü ve hazine dairesi en çok ilgi gören bölümlerdir. Boğaz manzarası ve tarihi atmosferiyle İstanbul'un vazgeçilmez durağıdır.", category: "Tarihi / Müze / Saray / UNESCO", coordinates: { lat: 41.0115, lng: 28.9833 } },
            { name: "Sultan Ahmet Camii", city: "İstanbul", description: "Sultan Ahmet Camii, altı minaresi ve mavi İznik çinileriyle ünlü olup, İstanbul'un en ikonik simgelerinden biridir. 17. yüzyılda inşa edilen cami, Osmanlı mimarisinin en güzel örneklerinden biri olarak kabul edilir. İç mekanındaki 20.000'den fazla el yapımı çini, ziyaretçileri büyüler. Ayasofya'nın karşısında yer alan cami, hala aktif olarak ibadete açıktır.", category: "Tarihi / Mimari / Dini", coordinates: { lat: 41.0054, lng: 28.9768 } },
            { name: "Nemrut Dağı", city: "Adıyaman", description: "Nemrut Dağı, dev taş başları ve antik mezar kutsal alanıyla ünlü UNESCO Dünya Mirası alanıdır. Kommagene Krallığı döneminden kalma bu eşsiz anıt, 2134 metre yükseklikte yer alır. Gündoğumu ve günbatımı manzaraları nefes kesici güzellikte olup, fotoğraf tutkunları için cennet gibidir. Antilokhos'un mezar tümülüsü ve heykelleri, antik dönemin sanat anlayışını yansıtan önemli eserlerdir.", category: "Tarihi / UNESCO / Arkeolojik / Dağ", coordinates: { lat: 37.9811, lng: 38.7411 } },
            { name: "Sümela Manastırı", city: "Trabzon", description: "Sümela Manastırı, Trabzon'un Maçka ilçesinde Altındere Vadisi'nde yer alan ve kayalara oyulmuş Bizans dönemi manastırıdır. 4. yüzyılda kurulan manastır, Karadeniz'in en önemli tarihi ve dini yapılarından biridir. 300 metre yükseklikteki kayalık yamaca inşa edilen yapı, hem mimari hem de doğal güzellikleriyle büyüler. Freskleri ve ikonaları ile Ortodoks sanatının en güzel örneklerini barındırır.", category: "Tarihi / Dini / Bizans / Doğa", coordinates: { lat: 40.6911, lng: 39.6637 } }
        ]
    },
    'france': {
        name: 'FRANSA',
        places: [
            { name: "Eyfel Kulesi", city: "Paris", description: "Paris'in simgesi olan ikonik demir kafes kulesi, 1889 yılında inşa edilmiştir. 324 metre yüksekliğindeki kule, şehrin muhteşem manzarasını sunan gözlem katlarıyla ünlüdür. Gustave Eiffel tarafından tasarlanan yapı, başlangıçta geçici olarak planlanmış ancak Paris'in vazgeçilmez simgesi haline gelmiştir. Yılda milyonlarca turist tarafından ziyaret edilen kule, gece ışıklandırmasıyla büyüleyici bir görünüm sergiler.", category: "Simge / Mimari / Turistik", coordinates: { lat: 48.8584, lng: 2.2945 } },
            { name: "Louvre Müzesi", city: "Paris", description: "Dünyanın en büyük sanat müzesi ve tarihi anıtı olan Louvre, binlerce esere ev sahipliği yapar. Mona Lisa ve Milo Venüsü gibi dünyaca ünlü eserlerin bulunduğu müze, sanat severlerin vazgeçilmez durağıdır. Eski kraliyet sarayı olan yapı, cam piramidiyle modern mimarinin de güzel bir örneğini sunar. Her yıl 10 milyondan fazla ziyaretçi ağırlayan müze, Paris'in kültürel kalbidir.", category: "Müze / Sanat / Kültürel / Tarihi", coordinates: { lat: 48.8606, lng: 2.3376 } },
            { name: "Versay Sarayı", city: "Versailles", description: "UNESCO Dünya Mirası alanı olan Versay Sarayı, eski kraliyet ikametgahı olarak ünlüdür. Görkemli sarayı, muhteşem bahçeleri ve Aynalar Salonu ile dikkat çeker. 17. yüzyılda XIV. Louis döneminde inşa edilen saray, Fransız monarşisinin gücünün simgesidir. Geniş park alanları, fıskiyeleri ve Marie Antoinette'in çiftliği ile ziyaretçilere unutulmaz bir deneyim sunar.", category: "Tarihi / UNESCO / Saray / Bahçeler", coordinates: { lat: 48.8049, lng: 2.1204 } },
            { name: "Notre-Dame Katedrali", city: "Paris", description: "Gotik mimarinin şaheseri olan Notre-Dame Katedrali, UNESCO Dünya Mirası alanıdır. Uçan payandaları, gül pencereleri ve gargoilleriyle ünlü olan katedral, Paris'in en önemli dini yapılarından biridir. 12. yüzyılda inşaatına başlanan katedral, Victor Hugo'nun romanıyla da dünyaca tanınmıştır. 2019 yangınından sonra restore edilen yapı, Fransız kültürünün önemli bir parçasıdır.", category: "Tarihi / Dini / Mimari / UNESCO", coordinates: { lat: 48.8530, lng: 2.3499 } },
            { name: "Mont-Saint-Michel", city: "Normandiya", description: "Gelgit adasında yer alan ortaçağ manastırıyla ünlü UNESCO Dünya Mirası alanıdır. Fransa'nın en tanınabilir simgelerinden biri olan bu eşsiz yapı, deniz seviyesindeki değişimlerle adeta büyülü bir görünüm sergiler. 8. yüzyılda kurulan manastır, hem mimari hem de doğal güzellikleriyle ziyaretçilerini büyüler. Dar sokakları, tarihi evleri ve panoramik manzaralarıyla unutulmaz bir deneyim sunar.", category: "Tarihi / UNESCO / Dini / Ada", coordinates: { lat: 48.6361, lng: -1.5115 } },
            { name: "Chambord Şatosu", city: "Loire Vadisi", description: "Loire Vadisi'ndeki Rönesans şatosu, kendine özgü Fransız mimarisi ve çift sarmal merdivenıyla ünlüdür. 16. yüzyılda I. François döneminde inşa edilen şato, Fransız Rönesansının en güzel örneklerinden biridir. 440 oda ve 282 bacası bulunan devasa yapı, av partileri için kullanılırdı. Geniş park alanları ve muhteşem mimarisiyle Loire Vadisi'nin incisidir.", category: "Tarihi / Şato / Mimari / Rönesans", coordinates: { lat: 47.6162, lng: 1.5170 } },
            { name: "Provence Lavanta Tarlaları", city: "Provence", description: "Haziran-Ağustos aylarında çiçek açan muhteşem mor lavanta tarlaları, Güney Fransa'nın ikonik manzarasıdır. Valensole platosu ve Sault bölgesi en ünlü lavanta alanlarıdır. Bu büyüleyici manzara, fotoğraf tutkunları ve doğa severlerin gözdesidir. Lavanta hasadı sırasında düzenlenen festivaller, bölgeye ayrı bir renk katar.", category: "Doğa / Manzara / Tarım / Fotoğraf", coordinates: { lat: 43.9352, lng: 5.0077 } },
            { name: "Fransız Rivierası", city: "Nice", description: "Akdeniz kıyısındaki görkemli sahil şeridi, plajları, lüks tatil köyleri ve Cannes Film Festivali ile ünlüdür. Nice, Monaco, Cannes ve Saint-Tropez gibi glamur dolu şehirleri barındırır. Turkuaz rengi denizi, palmiye ağaçları ve lüks yaşam tarzıyla dünya çapında ünlü bir destinasyondur. Sanat galerileri, lüks restoranlar ve eğlence mekanlarıyla zengin bir kültürel yaşam sunar.", category: "Sahil / Lüks / Plaj / Eğlence", coordinates: { lat: 43.7102, lng: 7.2620 } }
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
        name: 'JAPONYA',
        places: [
            { name: "Fuji Dağı", city: "Honshu", description: "Japonya'nın en yüksek dağı ve kutsal simgesi olan Fuji Dağı, UNESCO Dünya Mirası alanıdır. Mükemmel koni şekli ve kültürel önemiyle ünlü olan dağ, Japonya'nın ulusal simgesidir. 3776 metre yüksekliğindeki aktif volkan, tırmanış sezonu olan Temmuz-Eylül aylarında binlerce dağcıyı ağırlar. Kawaguchi ve Hakone göllerinden görülen manzarası nefes kesicidir.", category: "Dağ / UNESCO / Kutsal / Doğa", coordinates: { lat: 35.3606, lng: 138.7274 } },
            { name: "Fushimi Inari Tapınağı", city: "Kyoto", description: "Binlerce kırmızı torii kapısının dağ yamacında tüneller oluşturduğu ünlü Shinto tapınağıdır. İnari tanrısına adanmış bu tapınak, Japonya'nın en fotograflanan yerlerinden biridir. 4 kilometre uzunluğundaki yürüyüş rotası, mistik bir atmosfer sunar. Gece aydınlatması ile büyüleyici bir görünüm sergiler.", category: "Dini / Kültürel / Tapınak / Yürüyüş", coordinates: { lat: 34.9671, lng: 135.7727 } },
            { name: "Tokyo Skytree", city: "Tokyo", description: "Tokyo'nun panoramik manzarasını sunan dünyanın ikinci en yüksek yapısıdır. 634 metre yüksekliğindeki modern yayın kulesi ve turistik cazibe merkezi, şehrin simgelerinden biridir. İki gözlem katından Tokyo'nun 360 derece manzarası izlenebilir. Alışveriş merkezi ve akvaryumuyla da ziyaretçilere çeşitli aktiviteler sunar.", category: "Modern / Simge / Manzara / Turistik", coordinates: { lat: 35.7101, lng: 139.8107 } },
            { name: "Kinkaku-ji Tapınağı", city: "Kyoto", description: "Altın yaprakla kaplı Altın Pavilyon, çevresindeki gölete yansımasıyla ünlü UNESCO Dünya Mirası alanıdır. 14. yüzyılda inşa edilen Zen tapınağı, Japonya'nın en güzel yapılarından biridir. Dört mevsim farklı güzellikler sergileyen bahçesi, geleneksel Japon peyzaj mimarisinin şaheseridir. Özellikle sonbahar renkleri ve kar manzarası büyüleyicidir.", category: "Dini / UNESCO / Tapınak / Altın", coordinates: { lat: 35.0394, lng: 135.7292 } },
            { name: "Hiroshima Barış Anıtı", city: "Hiroshima", description: "Atom bombası kurbanlarını anan UNESCO Dünya Mirası alanıdır. Barış Anıtı Parkı ve Müzesi, dünya barışının önemini vurgular. A-Bomb Dome, bombanın etkilerini gösteren en önemli kalıntıdır. Her yıl 6 Ağustos'ta düzenlenen barış törenleri, dünya çapında ilgi görür.", category: "Anıt / UNESCO / Tarihi / Barış", coordinates: { lat: 34.3955, lng: 132.4536 } },
            { name: "Arashiyama Bambu Ormanı", city: "Kyoto", description: "Doğal yeşil tüneller oluşturan büyüleyici bambu ormanı, popüler yürüyüş rotasıdır. Rüzgarın bambu yaprakları arasından geçerken çıkardığı ses, mistik bir atmosfer yaratır. Işık oyunları ve gölgelerle eşsiz fotoğraf fırsatları sunar. Tenryu-ji Tapınağı'na yakın konumuyla kültürel bir deneyim de sağlar.", category: "Doğa / Orman / Manzara / Yürüyüş", coordinates: { lat: 35.0170, lng: 135.6761 } },
            { name: "Senso-ji Tapınağı", city: "Tokyo", description: "MS 628 yılında kurulan Tokyo'nun en eski tapınağıdır. Kaminarimon (Gök Gürültüsü Kapısı) ve geleneksel alışveriş caddesi Nakamise-dori ile ünlüdür. Asakusa bölgesinin kalbi olan tapınak, geleneksel Japon kültürünü yaşatan önemli bir merkezdir. Festival dönemlerinde düzenlenen etkinlikler, ziyaretçilere unutulmaz deneyimler sunar.", category: "Dini / Tarihi / Tapınak / Geleneksel", coordinates: { lat: 35.7148, lng: 139.7967 } }
        ]
    },
    'china': {
        name: 'ÇİN',
        places: [
            { name: "Çin Seddi", city: "Beijing", description: "Dünyanın en uzun yapısı olan Çin Seddi, UNESCO Dünya Mirası alanıdır. 21.000 kilometre uzunluğundaki bu devasa yapı, Çin'in kuzey sınırlarını korumak için inşa edilmiştir. Ming Hanedanlığı döneminde bugünkü şeklini alan sed, milyonlarca işçinin emeğiyle tamamlanmıştır. Badaling ve Mutianyu bölümleri en çok ziyaret edilen kısımlardır.", category: "Tarihi / UNESCO / Mimari / Antik", coordinates: { lat: 40.4319, lng: 116.5704 } },
            { name: "Yasak Şehir", city: "Beijing", description: "Ming ve Qing hanedanlıklarının sarayı olan Yasak Şehir, dünyanın en büyük saray kompleksidir. 980 binadan oluşan UNESCO Dünya Mirası alanı, Çin mimarisinin en güzel örneklerini barındırır. 24 imparator tarafından kullanılan saray, günümüzde Saray Müzesi olarak hizmet vermektedir. Altın çatıları ve kırmızı duvarlarıyla Çin kültürünün simgesidir.", category: "Tarihi / UNESCO / Saray / Müze", coordinates: { lat: 39.9163, lng: 116.3972 } },
            { name: "Terracotta Ordusu", city: "Xi'an", description: "İlk Çin İmparatoru Qin Shi Huang'ın mezarını koruyan binlerce pişmiş toprak asker heykeli, UNESCO Dünya Mirası alanıdır. 1974 yılında keşfedilen bu arkeolojik harika, her biri farklı yüz ifadesine sahip 8000'den fazla savaşçı heykeli içerir. MÖ 3. yüzyılda yapılan eserler, antik Çin sanatının ve teknolojisinin şaheseridir. Üç ayrı çukurda sergilenen ordu, dünya çapında ilgi görür.", category: "Arkeolojik / UNESCO / Tarihi / Sanat", coordinates: { lat: 34.3848, lng: 109.2734 } },
            { name: "Zhangjiajie Milli Parkı", city: "Hunan", description: "Avatar filminin ilham kaynağı olan Zhangjiajie, UNESCO Dünya Mirası alanıdır. Binlerce kuvars kumtaşı sütununun oluşturduğu eşsiz manzara, doğa severlerin cennetidir. Dünyanın en uzun cam köprüsü ve en yüksek açık hava asansörü burada yer alır. Bulutların arasından yükselen kayalar, mistik bir atmosfer yaratır.", category: "Doğa / UNESCO / Milli Park / Manzara", coordinates: { lat: 29.3167, lng: 110.4783 } },
            { name: "Li Nehri", city: "Guilin", description: "Çin'in en güzel nehir manzaralarından biri olan Li Nehri, karst dağları arasından akar. Guilin'den Yangshuo'ya kadar uzanan nehir turu, nefes kesici manzaralar sunar. Geleneksel balıkçı tekneleri ve sularına yansıyan dağlar, Çin resim sanatının gerçek hayattaki karşılığıdır. 20 yuan banknotunun üzerindeki manzara bu bölgeden alınmıştır.", category: "Doğa / Nehir / Manzara / Tekne Turu", coordinates: { lat: 25.2736, lng: 110.1756 } }
        ]
    },
    'united_states': {
        name: 'AMERİKA BİRLEŞİK DEVLETLERİ',
        places: [
            { name: "Özgürlük Heykeli", city: "New York", description: "Amerika'nın özgürlük ve demokrasi simgesi olan Özgürlük Heykeli, UNESCO Dünya Mirası alanıdır. 1886 yılında Fransa tarafından hediye edilen heykel, New York Limanı'nda Liberty Adası'nda yer alır. 93 metre yüksekliğindeki heykel, milyonlarca göçmenin Amerika'ya gelişinin tanığıdır. Taç kısmına çıkarak New York manzarasını izlemek mümkündür.", category: "Simge / UNESCO / Tarihi / Özgürlük", coordinates: { lat: 40.6892, lng: -74.0445 } },
            { name: "Grand Canyon", city: "Arizona", description: "Colorado Nehri'nin milyonlarca yıl boyunca oyduğu Grand Canyon, UNESCO Dünya Mirası alanıdır. 446 kilometre uzunluğunda ve 1.6 kilometre derinliğindeki kanyon, dünyanın en büyük doğal harikalarından biridir. Farklı jeolojik katmanları, renk cümbüşü yaratan kayalar ve nefes kesici manzaralarıyla ünlüdür. Güney ve Kuzey Rim olmak üzere iki ana gözlem noktası bulunur.", category: "Doğa / UNESCO / Kanyon / Jeoloji", coordinates: { lat: 36.1069, lng: -112.1129 } },
            { name: "Yellowstone Milli Parkı", city: "Wyoming", description: "Dünyanın ilk milli parkı olan Yellowstone, UNESCO Dünya Mirası alanıdır. Jeotermal kaynakları, geyserleri ve zengin vahşi yaşamıyla ünlü olan park, 2.2 milyon hektar alanı kaplar. Old Faithful geyseri, Grand Prismatic sıcak kaynağı ve Yellowstone Gölü en popüler cazibe merkezleridir. Ayılar, kurtlar ve bizonlar gibi vahşi hayvanların doğal yaşam alanıdır.", category: "Doğa / UNESCO / Milli Park / Jeotermal", coordinates: { lat: 44.4280, lng: -110.5885 } },
            { name: "Times Square", city: "New York", description: "Dünyanın Kavşağı olarak bilinen Times Square, New York'un kalbi ve Broadway tiyatro bölgesinin merkezidir. Neon ışıkları, dev reklamları ve sürekli hareketiyle 24 saat canlı olan meydan, yılda 50 milyon ziyaretçi ağırlar. Yılbaşı kutlamaları ve Broadway müzikalleriyle ünlü olan bölge, Amerikan pop kültürünün simgesidir. Alışveriş, yemek ve eğlence imkanlarıyla turistlerin gözdesidir.", category: "Şehir / Eğlence / Alışveriş / Kültür", coordinates: { lat: 40.7580, lng: -73.9855 } },
            { name: "Golden Gate Köprüsü", city: "San Francisco", description: "San Francisco'nun simgesi olan Golden Gate Köprüsü, dünyanın en ünlü köprülerinden biridir. 1937 yılında açılan köprü, Art Deco mimarisinin şaheseri olarak kabul edilir. 2.7 kilometre uzunluğundaki asma köprü, San Francisco Körfezi'ni geçer. Uluslararası Turuncu rengiyle sis içinde bile görülebilen köprü, fotoğraf tutkunlarının favorisidir.", category: "Mimari / Köprü / Simge / Mühendislik", coordinates: { lat: 37.8199, lng: -122.4783 } }
        ]
    },
    'united_kingdom': {
        name: 'BİRLEŞİK KRALLIK',
        places: [
            { name: "Big Ben", city: "Londra", description: "Londra'nın simgesi olan Big Ben, Westminster Sarayı'nın saat kulesidir. 1859 yılında tamamlanan Gotik Revival mimarisinin şaheseri, 96 metre yüksekliğindedir. Saatin çan sesleri BBC radyosunda yayınlanarak dünya çapında tanınır. Elizabeth Kulesi olarak da bilinen yapı, İngiliz Parlamentosu'nun bir parçasıdır.", category: "Tarihi / Mimari / Simge / Saat", coordinates: { lat: 51.4994, lng: -0.1245 } },
            { name: "Stonehenge", city: "Wiltshire", description: "Neolitik dönemden kalma gizemli taş çemberi, UNESCO Dünya Mirası alanıdır. MÖ 3100-1600 yılları arasında inşa edilen anıt, astronomik gözlemevi olarak kullanıldığı düşünülür. Dev sarsen taşları ve bluestone'ların nasıl taşındığı hala bir gizemdir. Gündoğumu ve günbatımında özel törenlerin yapıldığı kutsal bir alandır.", category: "Tarihi / UNESCO / Antik / Gizem", coordinates: { lat: 51.1789, lng: -1.8262 } },
            { name: "Edinburgh Kalesi", city: "Edinburgh", description: "İskoçya'nın başkenti Edinburgh'da volkanik bir kayanın üzerinde yer alan tarihi kaledir. 12. yüzyıldan beri İskoç kraliyet ailelerinin ikametgahı olan kale, şehrin simgesidir. İskoçya Taç Mücevherleri ve Kader Taşı burada sergilenir. Edinburgh Festival döneminde kale, kültürel etkinliklere ev sahipliği yapar.", category: "Tarihi / Kale / Kraliyet / İskoç", coordinates: { lat: 55.9486, lng: -3.1999 } },
            { name: "Tower Bridge", city: "Londra", description: "Londra'nın en ünlü köprülerinden biri olan Tower Bridge, Thames Nehri üzerinde yer alır. 1894 yılında açılan Viktorya dönemi mimarisinin şaheseri, açılır kapanır mekanizmasıyla ünlüdür. İki kule arasındaki cam yürüyüş yolu, nehir manzarasını sunar. Gece aydınlatmasıyla büyüleyici bir görünüm sergiler.", category: "Mimari / Köprü / Viktorya / Mühendislik", coordinates: { lat: 51.5055, lng: -0.0754 } },
            { name: "Windsor Kalesi", city: "Windsor", description: "Dünyanın en eski ve en büyük yaşayan kalesi olan Windsor, İngiliz Kraliyet ailesinin resmi ikametgahlarından biridir. 900 yıllık tarihi olan kale, 39 İngiliz hükümdarının evi olmuştur. St. George Şapeli, kraliyet düğünlerinin yapıldığı önemli bir mekandır. Devlet Daireleri ve Kraliçe Mary'nin Bebek Evi ziyaretçilerin ilgisini çeker.", category: "Tarihi / Kale / Kraliyet / Resmi", coordinates: { lat: 51.4839, lng: -0.6044 } }
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