chrome.tabs.query({}, function (tabs) {
  if (tabs.length > 0) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        // Utwórz nowy kontekst AudioContext
        var audioContext = new AudioContext();

        // Pobierz pierwszy element wideo lub audio na stronie
        var videoElement = document.querySelector("video, audio");

        // Sprawdź czy element został znaleziony
        if (videoElement) {
          // Element został znaleziony, możesz z nim teraz pracować
          console.log("Znaleziono element:", videoElement);

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

          // Funkcja obliczająca średnią częstotliwość tonów
          function calculateAverageFrequency() {
            // Pobierz dane o częstotliwościach
            analyser.getByteFrequencyData(dataArray);

            // Oblicz sumę częstotliwości
            var sum = 0;
            for (var i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }

            // Oblicz średnią częstotliwość
            var averageFrequency = sum / bufferLength;

            // Wydrukuj średnią częstotliwość do konsoli
            console.log("Średnia częstotliwość tonów:", averageFrequency);
            return averageFrequency;
          }

          // Wywołaj funkcję co 1 sekundę, aby regularnie obliczać średnią częstotliwość tonów
          var intervalId = setInterval(calculateAverageFrequency, 1000);

          // Zapisz identyfikator interwału w chrome.storage.session
          chrome.storage.session.set({ intervalId: intervalId });
        } else {
          console.log("Nie znaleziono elementu wideo ani audio na stronie.");
        }
      },
    });
  }
});
