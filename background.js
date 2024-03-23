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
              // // Eksperyment
              // Pobierz element textarea
              var textarea = document.getElementById("colour_data");

              // Ustaw nową wartość dla textarea
              textarea.value = `{"h": ${
                dataArray / 4
              }, "s": ${dataArray}, "v": ${dataArray}}`;
              let button =
                document.getElementsByClassName("ant-btn-primary")[0];
              function klikacz() {
                button.click();
              }
              klikacz();

              // Symuluj zdarzenie zmiany wartości pola tekstowego
              var event = new Event("input", { bubbles: true });
              textarea.dispatchEvent(event);
              // // Eksperyment
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
