if (document.location.href.includes("youtube.com")) {
  console.log("Dodawanie nasłuchiwacza na zmiany w pamięci sesji");

  chrome.storage.session.onChanged.addListener(function (changes, areaName) {
    console.log("czujka");
    if (changes.hasOwnProperty("intervalId")) {
      var intervalId = changes.intervalId.newValue;
      console.log("Nowy intervalId:", intervalId);
    }
  });

  // Funkcja obliczająca średnią częstotliwość tonów
  function calculateAverageFrequency(analyser, bufferLength, dataArray) {
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

    // Zapisz tablicę dataArray do sesji pamięci
    chrome.storage.session.set({ dataArray: averageFrequency }, function () {
      console.log("Tablica dataArray została zapisana do pamięci sesji.");

      // Pobierz dane z sesji pamięci
      chrome.storage.session.get("dataArray", function (data) {
        var dataArrayFromStorage = data.dataArray;
        // Tutaj możesz korzystać z dataArrayFromStorage
        chrome.runtime.sendMessage({
          action: "transferData",
          dataArray: dataArrayFromStorage,
        });
      });
    });

    chrome.runtime.sendMessage(
      {
        action: "transferData",
        dataArray: averageFrequency,
      },
      console.log("dane zostaly wysłąne na karte 2")
    );

    // Wywołaj funkcję ponownie przy użyciu requestAnimationFrame()
    requestAnimationFrame(() => {
      calculateAverageFrequency(analyser, bufferLength, dataArray);
    });
  }

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
