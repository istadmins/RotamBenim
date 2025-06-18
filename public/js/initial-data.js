// Initial places for new users
// Add more places as needed
const initialPlacesData = [
    // FRANSA
    {
        userGivenId: 'fr_001',
        country: "FRANSA",
        name: "Paris",
        city: "Paris",
        description: "Dünyanın en romantik şehirlerinden biri olan Paris, 'Işık Şehir' olarak da anılır. İkonik Eyfel Kulesi'nden şehrin panoramik manzarasını izleyebilir, Seine Nehri'nde tekne turu yapabilir ve dünyaca ünlü sanat eserlerine ev sahipliği yapan Louvre Müzesi'ni gezebilirsiniz. Şık bulvarları, tarihi kafeleri, bohem mahalleleri ve eşsiz Fransız mutfağıyla unutulmaz bir deneyim sunar.",
        category: "Başkent / İkonik / Kültürel / Sanat",
        visited: false,
        mapQuery: "Paris, Fransa",
        selectedForRoute: false
    },
    {
        userGivenId: 'fr_002',
        country: "FRANSA",
        name: "Eyfel Kulesi",
        city: "Paris",
        description: "Paris'in ve Fransa'nın en tanınmış sembolü olan Eyfel Kulesi, Gustave Eiffel tarafından 1889 Evrensel Sergisi için tasarlanmıştır. Yılda milyonlarca ziyaretçi çeken bu demir kule, farklı katlarından şehrin muhteşem panoramik manzaralarını sunar. Gece ışıklandırmasıyla da büyüleyicidir.",
        category: "İkonik Yapı / Mimari / Manzara",
        visited: false,
        mapQuery: "Eyfel Kulesi, Paris",
        selectedForRoute: false
    },
    // ESTONYA
    {
        userGivenId: 'ee_001',
        country: "ESTONYA",
        name: "Tallinn",
        city: "Tallinn",
        description: "UNESCO Orta Çağ eski şehri.",
        category: "Başkent / Tarihi Şehir",
        visited: false,
        mapQuery: "Tallinn, Estonya",
        selectedForRoute: false
    }
    // Add more initial places here as needed
];

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = initialPlacesData;
}
window.initialPlacesData = initialPlacesData;
