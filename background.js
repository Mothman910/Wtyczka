chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "transferData") {
    console.log("Odebrano dane z content script:", message.dataArray);
    let dataArray = message.dataArray;
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      if (tabs.length >= 2) {
        var targetTab = tabs.find((tab) => tab.url.includes("eu.iot.tuya.com"));
        chrome.scripting.executeScript({
          target: { tabId: targetTab.id },
          func: function (dataArray) {
            // Znajdź element textarea o identyfikatorze "colour_data"
            var textArea = document.getElementById("colour_data");

            // Sprawdź, czy element został znaleziony
            if (textArea) {
              console.log(dataArray);
              // Podmień zawartość textarea na nowy tekst
              textArea.value = `{"h": 158, "s": 470, "v": ${
                Math.round(dataArray) * 10
              }}`;
              // Stwórz obserwator mutacji dla elementu textarea
              var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                  // Ponownie ustaw wartość textarea po zmianie
                  textArea.value = `{"h": 158, "s": 470, "v": ${
                    Math.round(dataArray) * 10
                  }}`;
                });
              });

              // Rozpocznij obserwację mutacji dla elementu textarea
              observer.observe(textArea, {
                attributes: true,
                childList: true,
                subtree: true,
              });
            } else {
              console.log(
                "Nie znaleziono elementu textarea o identyfikatorze 'colour_data'"
              );
              // Znajdź element textarea
              var textArea = document.getElementById("colour_data");

              // Dodaj nasłuchiwanie na zdarzenie input
              textArea.addEventListener("input", function (event) {
                // Loguj zmiany w konsoli
                console.log(
                  "Zawartość textarea została zmieniona:",
                  event.target.value
                );
              });

              // Dodaj nasłuchiwanie na zdarzenie change
              textArea.addEventListener("change", function (event) {
                // Loguj zmiany w konsoli
                console.log(
                  "Zawartość textarea została zmieniona:",
                  event.target.value
                );
              });
            }
          },

          args: [dataArray],
        });
      } else {
        console.log("Nie znaleziono drugiej karty w bieżącym oknie.");
      }
    });
  }
});
