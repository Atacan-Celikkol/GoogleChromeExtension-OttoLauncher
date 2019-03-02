var Endpoints = {
    dailyWeather: function (id) {
        return 'https://servis.mgm.gov.tr/api/tahminler/gunluk?istno=' + id
    },
    nowWeather: function (id) {
        return 'https://servis.mgm.gov.tr/api/sondurumlar?merkezid=' + id
    }
}
var CityCodes = {
    Istanbul: '93401'
}

var HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
}
var client = new HttpClient();

client.get(Endpoints.dailyWeather(CityCodes.Istanbul), function (response) {
    var response = JSON.parse(response);

    var body = document.getElementById("weather-nextdays");

    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let index = 0; index < 5; index++) {
        const item = response[0];

        var p1 = 'tarihGun' + (index + 1).toString();
        var p2 = 'enDusukGun' + (index + 1).toString();
        var p3 = 'enYuksekGun' + (index + 1).toString();
        var p4 = 'enDusukNemGun' + (index + 1).toString();
        var p5 = 'enYuksekNemGun' + (index + 1).toString();
        var p6 = 'hadiseGun' + (index + 1).toString();
        var p7 = 'ruzgarHizGun' + (index + 1).toString();

        var date = new Date(item[p1]);
        var dayName = days[date.getDay()];

        body.innerHTML +=
            `<div>
             <h4 id="Id">${dayName}</h4>
             <img class="weather-icon" src="../assets/WeatherIcons/${item[p6]}.svg" alt="">
             <h5 id="temperature">${item[p2]} - ${item[p3]}</h5>
             </div>`;
    }
});



client.get(Endpoints.nowWeather(CityCodes.Istanbul), function (response) {
    var response = JSON.parse(response)[0];

    var element = document.getElementById("today");
    element.innerHTML =
        `
        <div class="today-weather-top">
        <h1 id="city">Istanbul</h1>
        <img id="weather-now-icon" class="weather-icon" src="../assets/WeatherIcons/${response.hadiseKodu}.svg" alt="">
        <h1 id="temperature-now">${response.sicaklik}°C</h1>
        </div>        
        <br>
        <img style='transform: rotate(${response.ruzgarYon}deg);' src="../assets/WeatherIcons/ryon-gri.svg" alt="" height='40px'><h3>${response.ruzgarHiz}<br> Km/h</h3>
        <div class="divider"></div>
        <h1>H</h1><h3>${response.nem}%<br></h3>
        <div class="divider"></div>
        <h1>C</h1><h3>${response.kapalilik}<br></h3>
        <div class="divider"></div>
        <h1>P</h1><h3>${response.aktuelBasinc}<br></h3>
        `
});