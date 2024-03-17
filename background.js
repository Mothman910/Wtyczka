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
            } else {
              console.log(
                "Nie znaleziono elementu textarea o identyfikatorze 'colour_data'"
              );
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
