// Country and Place Service for Adding New Countries and Places
class CountryPlaceService {
    constructor() {
        this.countryData = {
            // FRANSA
            'FRANSA': {
                name: 'FRANSA',
                description: 'Sanat, kültür ve gastronominin kalbi. Paris\'in romantik atmosferinden Provence\'ın lavanta tarlalarına kadar her köşesi büyüleyici.',
                places: [
                    {
                        name: 'Paris',
                        city: 'Paris',
                        description: 'Dünyanın en romantik şehirlerinden biri olan Paris, "Işık Şehir" olarak da anılır. İkonik Eyfel Kulesi\'nden şehrin panoramik manzarasını izleyebilir, Seine Nehri\'nde tekne turu yapabilir ve dünyaca ünlü sanat eserlerine ev sahipliği yapan Louvre Müzesi\'ni gezebilirsiniz. Şık bulvarları, tarihi kafeleri, bohem mahalleleri ve eşsiz Fransız mutfağıyla unutulmaz bir deneyim sunar.',
                        category: 'Başkent / İkonik / Kültürel / Sanat',
                        mapQuery: 'Paris, Fransa'
                    },
                    {
                        name: 'Eyfel Kulesi',
                        city: 'Paris',
                        description: 'Paris\'in ve Fransa\'nın en tanınmış sembolü olan Eyfel Kulesi, Gustave Eiffel tarafından 1889 Evrensel Sergisi için tasarlanmıştır. Yılda milyonlarca ziyaretçi çeken bu demir kule, farklı katlarından şehrin muhteşem panoramik manzaralarını sunar. Gece ışıklandırmasıyla da büyüleyicidir.',
                        category: 'İkonik Yapı / Mimari / Manzara',
                        mapQuery: 'Eyfel Kulesi, Paris'
                    },
                    {
                        name: 'Louvre Müzesi',
                        city: 'Paris',
                        description: 'Dünyanın en büyük ve en çok ziyaret edilen sanat müzesi olan Louvre, Mona Lisa, Venus de Milo ve Kanatlı Zafer gibi paha biçilemez başyapıtlara ev sahipliği yapar. Eski bir kraliyet sarayı olan yapı, cam piramidiyle ünlü girişinden geçerek binlerce yıllık sanat ve medeniyet tarihine bir yolculuk sunar.',
                        category: 'Müze / Sanat / Tarih / Kültürel Miras',
                        mapQuery: 'Louvre Müzesi, Paris'
                    },
                    {
                        name: 'Mont Saint-Michel',
                        city: '',
                        description: 'Normandiya kıyılarında, gelgit sularıyla çevrili kayalık bir ada üzerinde yükselen bu görkemli Orta Çağ manastırı ve köyü, masalsı bir görünüme sahiptir. Dar sokakları, tarihi yapıları ve tepesinden sunduğu muhteşem manzaralarla UNESCO Dünya Mirası listesindedir.',
                        category: 'Tarihi Yapı / Manastır / UNESCO / Ada',
                        mapQuery: 'Mont Saint-Michel, Fransa'
                    },
                    {
                        name: 'Versailles Sarayı',
                        city: 'Versailles',
                        description: 'Fransız monarşisinin gücünü ve ihtişamını simgeleyen bu devasa saray, Barok mimarinin en görkemli örneklerindendir. Ünlü Aynalar Salonu, kraliyet daireleri ve André Le Nôtre tarafından tasarlanan uçsuz bucaksız bahçeleriyle ziyaretçilerini büyüler.',
                        category: 'Saray / Tarihi Yapı / Bahçe / UNESCO / Barok',
                        mapQuery: 'Versailles Sarayı'
                    },
                    {
                        name: 'Nice',
                        city: 'Nice',
                        description: 'Fransız Rivierası\'nın kalbi olan Nice, Akdeniz\'in masmavi suları, palmiyelerle süslü Promenade des Anglais kordonu, renkli eski şehri ve canlı çiçek pazarıyla ünlüdür. Matisse ve Chagall gibi sanatçıların eserlerini barındıran müzeleri ve Akdeniz mutfağıyla keyifli bir tatil vaat eder.',
                        category: 'Şehir / Tatil / Kıyı / Sanat / Pazar',
                        mapQuery: 'Nice, Fransa'
                    },
                    {
                        name: 'Provence',
                        city: '',
                        description: 'Güney Fransa\'nın bu büyüleyici bölgesi, yaz aylarında mora bürünen uçsuz bucaksız lavanta tarlaları, altın sarısı ayçiçeği tarlaları, zeytinlikleri ve tarihi Roma kalıntılarıyla ünlüdür. Sanatçılara ilham veren ışığı ve renkleriyle bilinir.',
                        category: 'Bölge / Kültürel / Doğa / Gastronomi / Kırsal / Tarihi',
                        mapQuery: 'Provence, Fransa'
                    },
                    {
                        name: 'Loire Vadisi',
                        city: '',
                        description: 'Fransa\'nın "Bahçesi" olarak da bilinen Loire Vadisi, görkemli şatoları, verimli üzüm bağları, tarihi kasabaları ve Loire Nehri boyunca uzanan pitoresk manzaralarıyla UNESCO Dünya Mirası listesindedir.',
                        category: 'Bölge / Şato / Kültürel / Şarap / UNESCO / Bisiklet',
                        mapQuery: 'Loire Valley, Fransa'
                    },
                    {
                        name: 'Cote d\'Azur',
                        city: '',
                        description: 'Akdeniz kıyı şeridinin bu efsanevi bölümü, Nice, Cannes, Antibes, Monaco ve Saint-Tropez gibi dünyaca ünlü tatil beldelerine ev sahipliği yapar. Göz alıcı plajları, turkuaz suları ve lüks yatlarıyla bilinir.',
                        category: 'Kıyı Şeridi / Tatil / Lüks / Manzara / Kültürel',
                        mapQuery: 'French Riviera'
                    },
                    {
                        name: 'Chamonix ve Mont Blanc',
                        city: 'Chamonix',
                        description: 'Avrupa\'nın en yüksek zirvesi olan Mont Blanc\'ın eteklerinde yer alan Chamonix, dünyaca ünlü bir dağcılık, tırmanış, kayak ve kış sporları merkezidir. Aiguille du Midi teleferiği ile muhteşem Alp manzaralarını izleyebilirsiniz.',
                        category: 'Doğa / Spor / Dağ / Manzara / Kayak',
                        mapQuery: 'Chamonix Mont Blanc'
                    }
                ]
            },
            
            // İTALYA
            'İTALYA': {
                name: 'İTALYA',
                description: 'Rönesans sanatı, lezzetli mutfağı ve tarihi zenginliğiyle dünyanın en çekici ülkelerinden biri. Roma\'dan Venedik\'e, Floransa\'dan Amalfi Sahili\'ne kadar her bölgesi ayrı bir hikaye anlatır.',
                places: [
                    {
                        name: 'Roma',
                        city: 'Roma',
                        description: 'Binlerce yıllık tarihiyle "Ebedi Şehir" Roma, Kolezyum, Roma Forumu, Pantheon gibi antik dünyanın görkemli kalıntılarına ev sahipliği yapar. Vatikan Şehri, Trevi Çeşmesi ve İspanyol Merdivenleri gibi ikonik yapılarıyla adeta bir açık hava müzesidir.',
                        category: 'Başkent / Tarihi / Antik Kalıntı / Kültürel / Sanat / Gastronomi',
                        mapQuery: 'Roma, İtalya'
                    },
                    {
                        name: 'Venedik',
                        city: 'Venedik',
                        description: 'Su üzerine kurulu bu eşsiz şehir, labirenti andıran kanalları, zarif gondolları, daracık sokakları ve romantik atmosferiyle dünyanın en büyüleyici yerlerinden biridir. San Marco Meydanı ve Rialto Köprüsü şehrin simgeleridir.',
                        category: 'Şehir / Romantik / Eşsiz / Kültürel / UNESCO',
                        mapQuery: 'Venedik, İtalya'
                    },
                    {
                        name: 'Floransa',
                        city: 'Floransa',
                        description: 'Rönesans\'ın doğduğu şehir Floransa, Uffizi Galerisi, Accademia Galerisi, Duomo Katedrali ve Ponte Vecchio gibi sanat ve mimari şaheserleriyle doludur. Michelangelo\'nun Davut heykeli ve Botticelli\'nin eserleri şehrin hazineleridir.',
                        category: 'Şehir / Sanat / Gastronomi / Rönesans / UNESCO',
                        mapQuery: 'Floransa, İtalya'
                    },
                    {
                        name: 'Amalfi Sahilleri',
                        city: '',
                        description: 'UNESCO Dünya Mirası listesinde yer alan bu nefes kesen kıyı şeridi, Tiren Denizi boyunca uzanır. Sarp kayalıklar üzerine kurulmuş Positano, Amalfi ve Ravello gibi rengarenk kasabaları ve teraslanmış limon bahçeleriyle Akdeniz\'in en güzel manzaralarından birini sunar.',
                        category: 'Kıyı Şeridi / Manzara / UNESCO / Şirin Kasaba / Yürüyüş',
                        mapQuery: 'Amalfi Coast, İtalya'
                    },
                    {
                        name: 'Cinque Terre',
                        city: '',
                        description: 'Ligurya kıyısında, sarp yamaçlara kurulmuş beş pitoresk balıkçı köyünden oluşan Cinque Terre, UNESCO Dünya Mirası listesindedir. Renkli evleri, daracık sokakları ve masmavi Akdeniz manzaralarıyla ünlüdür.',
                        category: 'Köy / Kıyı / Manzara / UNESCO / Yürüyüş / Şarap',
                        mapQuery: 'Cinque Terre, İtalya'
                    },
                    {
                        name: 'Dolomitler',
                        city: '',
                        description: 'Kuzey İtalya\'daki bu büyüleyici dağ silsilesi, UNESCO Dünya Mirası listesindedir. Sarp ve soluk renkli zirveleri, geniş alpin çayırları ve berrak gölleriyle ünlüdür. Via Ferrata tırmanış rotaları ve yürüyüş için idealdir.',
                        category: 'Dağ / Doğa / UNESCO / Spor / Manzara / Yürüyüş',
                        mapQuery: 'Dolomitler, İtalya'
                    },
                    {
                        name: 'Pisa Kulesi',
                        city: 'Pisa',
                        description: 'Temelindeki zemin sorunları nedeniyle eğik duran ve bu özelliğiyle dünyaca ünlenmiş çan kulesi, Pisa Katedrali\'nin bir parçasıdır. Mucizeler Meydanı\'nda yer alan kule, İtalya\'nın en çok tanınan sembollerinden biridir.',
                        category: 'İkonik Yapı / Mimari / Turistik / UNESCO',
                        mapQuery: 'Pisa Kulesi'
                    },
                    {
                        name: 'Siena',
                        city: 'Siena',
                        description: 'Toskana bölgesinin kalbinde yer alan Siena, iyi korunmuş Orta Çağ mimarisi, yelpaze şeklindeki ana meydanı Piazza del Campo ve burada yılda iki kez düzenlenen geleneksel Palio at yarışlarıyla ünlüdür.',
                        category: 'Tarihi Şehir / Kültürel / Etkinlik / Mimari',
                        mapQuery: 'Siena, İtalya'
                    },
                    {
                        name: 'Napoli ve Pompei',
                        city: 'Napoli',
                        description: 'Pizzanın doğduğu canlı ve kaotik şehir Napoli, zengin bir tarihi mirasa ve muhteşem bir körfeze sahiptir. Yakınındaki Pompei ise M.S. 79\'da Vezüv Yanardağı\'nın patlamasıyla küller altında kalmış, iyi korunmuş bir antik Roma kentidir.',
                        category: 'Antik Kalıntı / Şehir / Gastronomi / Tarihi Alan / UNESCO',
                        mapQuery: 'Pompei, İtalya'
                    },
                    {
                        name: 'Milano',
                        city: 'Milano',
                        description: 'İtalya\'nın moda, tasarım ve finans merkezi olan Milano, modern ve dinamik bir atmosfere sahiptir. Dünyaca ünlü markaların mağazalarına ev sahipliği yapan Galleria Vittorio Emanuele II ve görkemli Duomo Katedrali şehrin önemli noktalarıdır.',
                        category: 'Şehir / Moda / Sanat / Kültür / İş Merkezi',
                        mapQuery: 'Milano, İtalya'
                    }
                ]
            },
            
            // İSPANYA
            'İSPANYA': {
                name: 'İSPANYA',
                description: 'Flamenko dansı, tapas kültürü ve zengin tarihi mirasıyla İber Yarımadası\'nın en büyük ülkesi. Her bölgesi kendine özgü karakteri ve lezzetleriyle farklı bir deneyim sunar.',
                places: [
                    {
                        name: 'Barselona',
                        city: 'Barselona',
                        description: 'Katalonya\'nın başkenti Barselona, Antoni Gaudí\'nin eşsiz modernist mimarisinin damgasını vurduğu bir şehirdir. Yapımı hala devam eden La Sagrada Familia bazilikası, renkli mozaikleriyle Park Güell ve hareketli La Rambla caddesi şehrin en önemli noktalarıdır.',
                        category: 'Şehir / Mimari / Kültürel / Sanat',
                        mapQuery: 'Barselona, İspanya'
                    },
                    {
                        name: 'El Hamra Sarayı',
                        city: 'Granada',
                        description: 'Endülüs Emevileri döneminden kalma bu muhteşem saray ve kale kompleksi, İslam mimarisinin en ince ve zarif örneklerinden birini sunar. Detaylı alçı oymaları, renkli çinileri ve Generalife bahçeleriyle adeta bir masal diyarıdır.',
                        category: 'Saray / Tarihi Yapı / İslam Mimarisi / UNESCO',
                        mapQuery: 'El Hamra Sarayı, Granada'
                    },
                    {
                        name: 'Madrid',
                        city: 'Madrid',
                        description: 'İspanya\'nın hareketli başkenti Madrid, geniş bulvarları, zarif meydanları, dünyaca ünlü sanat müzeleri ve canlı gece hayatıyla bilinir. Kraliyet Sarayı ve Retiro Parkı da şehrin önemli noktalarıdır.',
                        category: 'Başkent / Kültürel / Sanat / Müze / Gastronomi',
                        mapQuery: 'Madrid, İspanya'
                    },
                    {
                        name: 'Sevilla',
                        city: 'Sevilla',
                        description: 'Endülüs bölgesinin başkenti ve en büyük şehri olan Sevilla, flamenko dansının, tapasların ve boğa güreşlerinin merkezidir. Alcázar Sarayı, Sevilla Katedrali ve Giralda Kulesi şehrin simgelerindendir.',
                        category: 'Şehir / Kültürel / Tarihi / Flamenko / Mimari',
                        mapQuery: 'Sevilla, İspanya'
                    },
                    {
                        name: 'La Concha',
                        city: 'San Sebastián',
                        description: 'San Sebastián şehrinde bulunan La Concha Plajı, Avrupa\'nın en güzel şehir plajlarından biri olarak kabul edilir. Hilal şeklindeki kumsalı, sakin suları ve çevresindeki zarif binalarıyla hem yerel halkın hem de turistlerin gözdesidir.',
                        category: 'Plaj / Şehir Plajı / Tatil',
                        mapQuery: 'La Concha, San Sebastián'
                    },
                    {
                        name: 'Valensiya Bilim ve Sanat Şehri',
                        city: 'Valensiya',
                        description: 'Santiago Calatrava ve Félix Candela tarafından tasarlanan bu fütüristik mimari kompleks, Valensiya\'nın en modern ve dikkat çekici yapılarından biridir. Opera binası, bilim müzesi ve Avrupa\'nın en büyük akvaryumu olan Oceanogràfic\'i içerir.',
                        category: 'Mimari / Bilim / Kültürel Kompleks / Modern',
                        mapQuery: 'Valensiya Bilim ve Sanat Şehri'
                    },
                    {
                        name: 'Mallorca',
                        city: 'Mallorca',
                        description: 'Balear Adaları\'nın en büyüğü olan Mallorca, turkuaz suları, beyaz kumlu plajları, sarp kayalıkları ve Serra de Tramuntana dağ silsilesi ile çeşitlilik sunar. Hem dinlenmek hem de aktif tatil yapmak isteyenler için ideal bir destinasyondur.',
                        category: 'Ada / Plaj / Doğa / Dağ',
                        mapQuery: 'Mallorca, İspanya'
                    },
                    {
                        name: 'Cordoba',
                        city: 'Cordoba',
                        description: 'Endülüs\'ün tarihi şehirlerinden biri olan Cordoba, özellikle Roma, İslam ve Hristiyan kültürlerinin izlerini taşıyan Mezquita-Catedral ile ünlüdür. Dar çiçekli sokakları ve tarihi Yahudi mahallesi ile ziyaretçilerine zamanda bir yolculuk sunar.',
                        category: 'Tarihi Şehir / Dini Yapı / Kültürel Miras',
                        mapQuery: 'Cordoba, İspanya'
                    },
                    {
                        name: 'Picos de Europa Ulusal Parkı',
                        city: '',
                        description: 'Kuzey İspanya\'da yer alan bu ulusal park, Cantabrian Dağları\'nın en yüksek ve en dramatik kesimlerini kapsar. Kireçtaşı zirveleri, derin kanyonları ve yemyeşil vadileriyle yürüyüşçüler ve doğa severler için bir cennettir.',
                        category: 'Milli Park / Doğa / Dağ / Yürüyüş',
                        mapQuery: 'Picos de Europa Ulusal Parkı, İspanya'
                    },
                    {
                        name: 'Teide Milli Parkı',
                        city: 'Tenerife',
                        description: 'Kanarya Adaları\'ndan Tenerife\'de bulunan Teide Milli Parkı, İspanya\'nın en yüksek zirvesi olan Teide Yanardağı\'na ev sahipliği yapar. Ay yüzeyini andıran volkanik manzaraları ve endemik bitki örtüsüyle UNESCO Dünya Mirası listesindedir.',
                        category: 'Milli Park / Volkan / Doğa / UNESCO',
                        mapQuery: 'Teide Milli Parkı, Tenerife'
                    }
                ]
            }
        };
    }
    
    // Get available countries
    getAvailableCountries() {
        return Object.keys(this.countryData);
    }
    
    // Get country data
    getCountryData(countryName) {
        return this.countryData[countryName.toUpperCase()];
    }
    
    // Get places for a country
    getCountryPlaces(countryName) {
        const country = this.getCountryData(countryName);
        return country ? country.places : [];
    }
    
    // Add new country with places
    addCountry(countryName, description, places) {
        const upperCountryName = countryName.toUpperCase();
        this.countryData[upperCountryName] = {
            name: upperCountryName,
            description: description,
            places: places
        };
    }
    
    // Search countries by name
    searchCountries(query) {
        const results = [];
        const searchTerm = query.toLowerCase();
        
        for (const countryName of Object.keys(this.countryData)) {
            if (countryName.toLowerCase().includes(searchTerm)) {
                results.push(countryName);
            }
        }
        
        return results;
    }
    
    // Get random places from a country (for suggestions)
    getRandomPlaces(countryName, count = 5) {
        const places = this.getCountryPlaces(countryName);
        if (places.length <= count) {
            return places;
        }
        
        const shuffled = [...places].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    // Validate place data
    validatePlace(place) {
        const required = ['name', 'description', 'category', 'mapQuery'];
        const missing = required.filter(field => !place[field]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }
        
        return true;
    }
    
    // Add place to existing country
    addPlaceToCountry(countryName, place) {
        this.validatePlace(place);
        
        const country = this.getCountryData(countryName);
        if (!country) {
            throw new Error(`Country ${countryName} not found`);
        }
        
        country.places.push(place);
        return true;
    }
    
    // Get statistics
    getStatistics() {
        const stats = {
            totalCountries: Object.keys(this.countryData).length,
            totalPlaces: 0,
            countriesWithPlaces: 0
        };
        
        for (const country of Object.values(this.countryData)) {
            stats.totalPlaces += country.places.length;
            if (country.places.length > 0) {
                stats.countriesWithPlaces++;
            }
        }
        
        return stats;
    }
}

// Global country place service instance
window.countryPlaceService = new CountryPlaceService(); 