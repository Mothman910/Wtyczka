if (document.location.href.includes("youtube.com")) {
  console.log("Dodawanie nasłuchiwacza na zmiany w pamięci sesji");

  // Funkcja obliczająca średnią częstotliwość tonów
  function calculateAverageFrequency(analyser, bufferLength, dataArray) {
    // Pobierz dane o częstotliwościach
    analyser.getByteFrequencyData(dataArray);

    // Oblicz sumę częstotliwości
    var sum = 0;
    for (var i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }

    // Dodaj sumę do tablicy
    sumArray.push(sum);

    // Jeśli tablica osiągnęła 10 elementów, oblicz średnią i wyślij na kartę Tuya
    if (sumArray.length === 20) {
      // Oblicz średnią
      var average = Math.round(
        sumArray.reduce((acc, currentValue) => acc + currentValue, 0) /
          sumArray.length /
          80
      );
      if (average > 1000) {
        average = 1000;
      }
      // Wyślij średnią na kartę Tuya
      chrome.runtime.sendMessage({
        action: "transferData",
        dataArray: average,
      });

      // Wyczyść tablicę
      sumArray = [];

      // Wydrukuj komunikat
      console.log(
        "Osiągnięto liczbę 10. Średnia częstotliwość tonów:",
        average
      );
    }

    // Wywołaj funkcję ponownie przy użyciu requestAnimationFrame()
    requestAnimationFrame(() => {
      calculateAverageFrequency(analyser, bufferLength, dataArray);
    });
  }

  // Inicjalizacja tablicy do przechowywania sum częstotliwości
  var sumArray = [];

  // Sprawdź, czy AudioContext jest dostępny
  if (typeof AudioContext !== "undefined") {
    // Przygotuj kontekst AudioContext
    var audioContext = new AudioContext();

    // Pobierz pierwszy element wideo lub audio na stronie
    var videoElement = document.querySelector("video, audio");

    // Sprawdź czy element został znaleziony
    if (videoElement) {
      // Utwórz węzeł analizatora dźwięku
      var analyser = audioContext.createAnalyser();

      // Podłącz wyjście audio z elementu wideo do analizatora
      var source = audioContext.createMediaElementSource(videoElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      // Rozmiar tablicy analizatora
      var bufferLength = analyser.frequencyBinCount;

      // Tablica do przechowywania danych o częstotliwościach
      var dataArray = new Uint8Array(bufferLength);

      // Wywołaj funkcję po raz pierwszy
      calculateAverageFrequency(analyser, bufferLength, dataArray);
    } else {
      console.log("Nie znaleziono elementu wideo ani audio na stronie.");
    }
  } else {
    console.log("AudioContext nie jest dostępny w tej przeglądarce.");
  }
}
