// js/fullpage-manager.js

class PexelsApiService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.pexels.com/v1/';
    }

    async fetchImage(query) {
        if (!this.apiKey || this.apiKey === 'BURAYA_PEXELS_API_ANAHTARINIZI_YAPIŞTIRIN') {
            console.error("Pexels API Key is not configured.");
            // Varsayılan bir resim veya renk döndür
            return 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg'; 
        }

        try {
            const response = await fetch(`${this.baseUrl}search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
                headers: {
                    Authorization: this.apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Pexels API error: ${response.statusText}`);
            }

            const data = await response.json();
            // Resim bulunduysa onun URL'ini, bulunamadıysa varsayılan bir URL döndür
            return data.photos.length > 0 ? data.photos[0].src.large2x : 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg';
        } catch (error) {
            console.error('Failed to fetch image from Pexels:', error);
            // Hata durumunda da varsayılan bir URL döndür
            return 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg';
        }
    }
}

class FullpageManager {
    constructor(pexelsApiKey) {
        this.container = document.getElementById('fullpage-container');
        this.statusElement = document.getElementById('fullpage-status');
        this.loader = document.getElementById('fullpage-loader');
        this.pexelsService = new PexelsApiService(pexelsApiKey);
    }

    // Yerleri ülkelere göre gruplandırır
    groupPlacesByCountry(places) {
        return places.reduce((acc, place) => {
            const country = place.country || 'Diğer';
            if (!acc[country]) {
                acc[country] = [];
            }
            acc[country].push(place);
            return acc;
        }, {});
    }

    // Her ülke için bir bölüm (section) oluşturur
    async createCountrySection(countryName, places) {
        const section = document.createElement('section');
        section.className = 'country-section';
        section.setAttribute('data-country', countryName);

        // Arka plan resmini yüklenirken geçici bir renk ver
        section.style.backgroundColor = '#2d3748'; // gray-800

        // İçerik için bir konteyner
        const contentDiv = document.createElement('div');
        contentDiv.className = 'section-content';
        
        const title = document.createElement('h2');
        title.className = 'country-title';
        title.textContent = countryName;
        contentDiv.appendChild(title);

        const placesList = document.createElement('ul');
        placesList.className = 'places-list-small custom-scrollbar';
        places.forEach(place => {
            const li = document.createElement('li');
            li.textContent = place.name;
            placesList.appendChild(li);
        });
        contentDiv.appendChild(placesList);

        section.appendChild(contentDiv);
        this.container.appendChild(section);

        // Arka plan resmini Pexels'dan çek ve ata
        const imageUrl = await this.pexelsService.fetchImage(`${countryName} landscape`);
        section.style.backgroundImage = `url(${imageUrl})`;
    }

    // Ana başlatma fonksiyonu
    async init(places) {
        if (!places || places.length === 0) {
            this.statusElement.textContent = 'No places found. Add some to get started!';
            return;
        }

        this.loader.classList.remove('hidden');
        this.statusElement.textContent = 'Loading your destinations...';
        
        // Mevcut karşılama ekranını kaldır
        this.container.innerHTML = ''; 

        const groupedPlaces = this.groupPlacesByCountry(places);
        const countries = Object.keys(groupedPlaces);

        for (const country of countries) {
            this.statusElement.textContent = `Creating section for ${country}...`;
            await this.createCountrySection(country, groupedPlaces[country]);
        }
        
        this.statusElement.parentElement.parentElement.classList.add('hidden'); // Tüm yükleme ekranını gizle
    }
}