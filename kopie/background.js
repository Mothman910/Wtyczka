// // Obiekt, który przechowuje informacje o kartach, dla których komunikat został już wyświetlony
// const tabsWithMessageDisplayed = {};

// // Funkcja obsługująca zdarzenie onActivated
// chrome.tabs.onActivated.addListener(async (activeInfo) => {
//   const tab = await chrome.tabs.get(activeInfo.tabId);
//   console.log(activeInfo);
//   handleTabChange(tab);
// });

// // Nasłuchiwanie na wiadomości wysłane z innych kart
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   // Sprawdź, czy to jest oczekiwana wiadomość
//   if (message.data) {
//     // Przetwórz otrzymane dane (w tym przypadku jest to amplituda dźwięku)
//     console.log("Otrzymano amplitudę dźwięku:", message.data);
//   }
// });

// chrome.tabs.query({}, function (tabs) {
//   if (tabs.length > 0) {
//     chrome.scripting.executeScript({
//       target: { tabId: tabs[0].id }, // zmiana na pierwszą kartę
//       func: () => {
//         console.log("czujniks");
//         // Utwórz nowy kontekst AudioContext
//         var audioContext = new AudioContext();

//         // Pobierz pierwszy element wideo na stronie
//         var videoElement = document.querySelector("video");

//         // Utwórz węzeł analizatora dźwięku
//         var analyser = audioContext.createAnalyser();

//         // Podłącz wyjście audio z elementu wideo do analizatora
//         var source = audioContext.createMediaElementSource(videoElement);
//         source.connect(analyser);
//         analyser.connect(audioContext.destination);
//         // Funkcja obliczająca średnią częstotliwość tonów
//         function calculateAverageFrequency() {
//           // Rozmiar tablicy analizatora
//           var bufferLength = analyser.frequencyBinCount;

//           // Tablica do przechowywania danych o częstotliwościach
//           var dataArray = new Uint8Array(bufferLength);

//           // Pobierz dane o częstotliwościach
//           analyser.getByteFrequencyData(dataArray);

//           // Oblicz sumę częstotliwości
//           var sum = 0;
//           for (var i = 0; i < bufferLength; i++) {
//             sum += dataArray[i];
//           }

//           // Oblicz średnią częstotliwość
//           var averageFrequency = sum / bufferLength;

//           // Zwróć średnią częstotliwość
//           return averageFrequency;
//         }

//         // Funkcja sprawdzająca amplitudę dźwięku
//         function checkSoundAmplitude() {
//           // Pobierz pierwszy element wideo na stronie
//           var videoElement = document.querySelector("video");

//           // Sprawdź, czy element wideo istnieje i czy ma dźwięk
//           if (videoElement && !videoElement.muted) {
//             // Pobierz amplitudę dźwięku
//             var soundAmplitude = calculateAverageFrequency();
//             console.log(soundAmplitude);
//             // Wyślij amplitudę dźwięku do aktywnej karty
//           }
//           document.addEventListener("click", function () {
//             var soundAmplitude = calculateAverageFrequency();
//             console.log(soundAmplitude);
//             // reszta kodu związana z analizatorem dźwięku
//           });
//         }

//         // Wywołaj funkcję co 1 sekundę, aby regularnie sprawdzać amplitudę dźwięku
//         setInterval(checkSoundAmplitude, 1000);
//       },
//       args: [],
//     });
//   }
// });

// // Funkcja obsługująca zmianę karty
// function handleTabChange(tab) {
//   // Wykonujemy skrypt w kontekście strony
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: (Data) => {
//       console.log("Aktywna karta została zmieniona lub zaktualizowana:", Data);
//     },
//     args: [tab],
//   });
// }
