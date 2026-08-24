// Real Browser GPS Geolocation & OpenStreetMap Nominatim Reverse Geocoding

export async function detectRealCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        try {
          // OpenStreetMap Nominatim Reverse Geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
            {
              headers: {
                'Accept-Language': 'en,hi'
              }
            }
          );
          
          if (!response.ok) {
            throw new Error('Could not fetch address details');
          }

          const data = await response.json();
          const addressObj = data.address || {};
          
          const formattedAddress = [
            addressObj.road || addressObj.suburb || addressObj.neighbourhood || '',
            addressObj.city || addressObj.town || addressObj.village || addressObj.county || '',
            addressObj.state || '',
            addressObj.postcode ? `PIN: ${addressObj.postcode}` : ''
          ].filter(Boolean).join(', ') || data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

          resolve({
            lat,
            lng,
            accuracy,
            address: formattedAddress,
            raw: data
          });
        } catch (err) {
          // Fallback with coordinates if reverse geocode fails
          resolve({
            lat,
            lng,
            accuracy,
            address: `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            raw: null
          });
        }
      },
      (error) => {
        let msg = 'Could not get your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  });
}
