const handleSubmit = async(event) => {
    event.preventDefault()

    let destinationCityInput = document.getElementById('destination-city').value
    
    const lat_long = await
    
    postDataCity('http://localhost:8081/city', {city: destinationCityInput})
    postDataWeather('http://localhost:8081/weather', {lat: lat_long.lat, lon: lat_long.long})
    postDataPicture('http://localhost:8081/cityPic', {city: destinationCityInput})

    
    // Getting Date info for UI
    let todayUI = new Date()
    let departureDateUI = new Date(document.getElementById('departure-date').value)
    let timeToDepartureUI = Math.round((departureDateUI - todayUI) / (1000*60*60*24))+1

    let dates = {todayUI, departureDateUI, timeToDepartureUI}

    // Getting Weather info for UI
    const weatherInformation = await
    postDataWeather('http://localhost:8081/weather', {lat: lat_long.lat, lon: lat_long.long})
    let maxtemp = weatherInformation.maxTemp;

    let weather = {maxtemp}
    
    console.log(weather)

    // Getting picture for updating the UI picture

    // Using the updateUI function
    const main = document.querySelector('main')
    const tripData = document.createElement('section')
    tripData.setAttribute('id', 'trip')
    tripData.innerHTML = Client.updateUI(lat_long, dates, weather);
    main.appendChild(tripData)
}


const postDataCity = async(city = "", data = {}) => {
    console.log('Analyzing Lat and Long', data);
    const geonamesData = await fetch(city, {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    try {
        const geonnamesJSON = await geonamesData.json();
        var lat_long = {
            city: geonnamesJSON.geonames[0].name,
            lat: geonnamesJSON.geonames[0].lat,
            long: geonnamesJSON.geonames[0].lng
        }
        console.log('Lat and Long Data Received:', lat_long)
        return lat_long;        
    } catch(error) {
        console.log('error', error);
    }
};

const postDataWeather = async(weather = "", data = {}) => {
    console.log('Analyzing Weather Data', data);
    
    let today = new Date()
    let departureDate = new Date(document.getElementById('departure-date').value)

    let timeToDeparture = Math.round((departureDate - today) / (1000*60*60*24))+1

    if (departureDate < today) {
        alert('Invalid Dates - Departure Date must be in the future')
        return
    }


    const weatherbitData = await fetch(weather, {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    try {
        const weatherbitJSON = await weatherbitData.json();
        if (timeToDeparture < 8) {
            var weatherInformation = {
                date: weatherbitJSON.data[0].valid_date,
                maxTemp: weatherbitJSON.data[0].max_temp
            }
        } else {
            var weatherInformation = {
                date: weatherbitJSON.data[`${timeToDeparture}`].valid_date,
                maxTemp: weatherbitJSON.data[`${timeToDeparture}`].max_temp
            }
        }
        console.log('Weather Data Received:', weatherInformation)
        return weatherInformation;        
    } catch(error) {
        console.log('error', error);
    }
};

const postDataPicture = async(city = "", data = {}) => {
    console.log('Analyzing', data);
    const pixabayData = await fetch(city, {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    try {
        const pixabayJSON = await pixabayData.json();
        var city_pic = {
            cityPicURL: pixabayJSON.hits[0].webformatURL
        }
        console.log('Pixabay Data Received:', city_pic)
        return city_pic;        
    } catch(error) {
        console.log('error', error);
    }
};


export { handleSubmit }