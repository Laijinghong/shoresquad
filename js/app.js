// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Initialize components
    initializeMap();
    initializeWeatherWidget();
    initializeImpactStats();
    initializeAnimations();
}

async function initializeMap() {
    // Placeholder for map implementation
    // TODO: Implement using Leaflet.js or Google Maps API
    const mapElement = document.getElementById('events-map');
    mapElement.innerHTML = '<div class="placeholder">Map Loading...</div>';
}

async function initializeWeatherWidget() {
    const currentConditions = document.getElementById('current-conditions');
    const forecastGrid = document.getElementById('forecast-grid');

    try {
        // Fetch current weather (using the realtime weather readings API)
        const currentResponse = await fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast');
        const currentData = await currentResponse.json();

        // Fetch 4-day forecast
        const forecastResponse = await fetch('https://api.data.gov.sg/v1/environment/24-hour-weather-forecast');
        const forecastData = await forecastResponse.json();

        // Get the forecast for Pasir Ris area (using the nearest forecast)
        const pasirRisArea = currentData.area_metadata.find(area =>
            area.name.toLowerCase().includes('pasir ris'));

        const currentForecast = currentData.items[0].forecasts.find(f =>
            f.area.toLowerCase().includes('pasir ris'));

        // Display current weather
        currentConditions.innerHTML = `
            <div class="weather-card">
                <div class="weather-icon">
                    ${getWeatherIcon(currentForecast.forecast)}
                </div>
                <div class="current-conditions-details">
                    <div class="temperature">${currentForecast.forecast}</div>
                    <div class="weather-detail">Pasir Ris Beach</div>
                    <div class="weather-detail">${new Date().toLocaleDateString('en-SG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</div>
                </div>
            </div>
        `;

        // Display forecast
        const periods = forecastData.items[0].periods || [];
        forecastGrid.innerHTML = periods.map(period => `
            <div class="forecast-card">
                <div class="forecast-date">${formatForecastDate(period.time.start)}</div>
                <div class="weather-icon">
                    ${getWeatherIcon(period.general.forecast)}
                </div>
                <div class="temperature">
                    ${period.general.temperature.low}°C - ${period.general.temperature.high}°C
                </div>
                <div class="weather-detail">
                    Humidity: ${period.general.relative_humidity.low}% - ${period.general.relative_humidity.high}%
                </div>
                <div class="weather-detail">
                    ${period.general.forecast}
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error fetching weather data:', error);
        currentConditions.innerHTML = '<div class="weather-error">Unable to load weather data</div>';
        forecastGrid.innerHTML = '<div class="weather-error">Unable to load forecast</div>';
    }
}

function getWeatherIcon(forecast) {
    const lowercaseForecast = forecast.toLowerCase();
    if (lowercaseForecast.includes('cloudy')) {
        return '<i class="fas fa-cloud"></i>';
    } else if (lowercaseForecast.includes('rain') || lowercaseForecast.includes('shower')) {
        return '<i class="fas fa-cloud-rain"></i>';
    } else if (lowercaseForecast.includes('thunder')) {
        return '<i class="fas fa-bolt"></i>';
    } else if (lowercaseForecast.includes('fair') || lowercaseForecast.includes('sunny')) {
        return '<i class="fas fa-sun"></i>';
    } else {
        return '<i class="fas fa-cloud"></i>'; // default icon
    }
}

function formatForecastDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

function initializeImpactStats() {
    // Placeholder for community impact statistics
    const impactStats = document.querySelector('.impact-stats');
    const stats = [
        { label: 'Beaches Cleaned', value: '50+' },
        { label: 'Volunteers', value: '1,000+' },
        { label: 'Trash Collected', value: '5 tons' }
    ];

    stats.forEach(stat => {
        const statElement = document.createElement('div');
        statElement.className = 'stat-card';
        statElement.innerHTML = `
            <h3>${stat.value}</h3>
            <p>${stat.label}</p>
        `;
        impactStats.appendChild(statElement);
    });
}

function initializeAnimations() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1 }
    );

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

function handleMapLoading() {
    const mapContainer = document.getElementById('map-container');
    const mapLoading = document.getElementById('map-loading');
    const mapError = document.getElementById('map-error');
    const iframe = mapContainer.querySelector('iframe');

    if (iframe) {
        iframe.onload = () => {
            mapLoading.style.display = 'none';
        };

        iframe.onerror = () => {
            mapLoading.style.display = 'none';
            mapError.style.display = 'block';
        };
    }
}

// Helper function for error handling
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    // TODO: Implement user-friendly error messaging
}

document.addEventListener('DOMContentLoaded', () => {
    handleMapLoading();
});
