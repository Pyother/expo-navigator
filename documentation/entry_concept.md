# Projekt transportowego robota mobilnego wykorzystującego systemy RTLS

Celem projektu jest stworzenie robota mobilnego przeznaczonego do transportu niewielkich ładunków. Inspiracją projektu są roboty przemysłowe AMR oraz AGV, przeznaczone do transportu na halach produkcynych. Najważniejszą funkcjonalnością systemu jest możliwość szybkiego oraz dokładnego określenia lokalizacji pojazdu, dzięki czemu będzie on w stanie dotrzeć do wyznaczonego przez użytkownika celu bez ingerencji operatora. 

## Infrastruktura

System określający lokalizację urządzenia jest najważniejszą częścią projektu. Opiera się on o koncepcję RTLS (ang. *Real-Time Locating/Location Systems*) - systemów lokalizowania w czasie rzeczywistym. Wdrożenie takiego systemu może opierać się na kliku różnych technologiach komunikacyjnych, ale ze względu na niskie koszty sprzętu oraz niskie wymagania infrastrukturalne optymalną opcją jest wykorzystanie technologii Bluetooth Low Energy. 

Takie rozwiązanie zakłada, że pojazd byłby przeznaczony do użytku tylko w specjalnie przygotowanej strefie. Znajdowałyby się w niej również specjalne lokalizatory, tzw. BLE Beacons. Pojazd komunikowałby się z nimi za pomocą technologii Bluetooth w celu określenia własnej lokalizacji. 

## Sposób określania lokalizacji

Urządzenia lokalizacyjne zostaną umieszczone w przestrzeni, po której poruszać się będzie pojazd. Odległość pomiędzy nimi będzie z góry ustalona lub podawana przez użytkownika systemu. Urządzenie będzie posiadać jednostkę odbierającą sygnały z wszystkich lokalizatorów (prawdopodobnie Arduino Uno R4 WiFi). Standard komunikacyjny BLE pozwala na określenie RSSI (ang. *Received Signal Strength Indication*). Jest to wskaźnik mocy odbieranego sygnału radiowego. Znając wskaźniki sygnałów, można skorzystać z tzw. trilateracji. Trilateracja polega na wyznaczeniu pozycji obiektu na podstawie odległości od co najmniej trzech znanych punktów referencyjnych. 

Załóżmy, że mamy trzy Beacony rozmieszczone w wierzchołkach trójkąta prostokątnego równoramiennego o długości ramion 2 metry. Oznaczmy odległości od urządzenia do każdego z Beaconów jako d1d1​, d2d2​ i d3d3​. Zdefiniujmy również współrzędne lokalizacji każdego Beaconu jako (xi,yi)(xi​,yi​), gdzie ii to indeks Beaconu.

Wzór na obliczenie lokalizacji urządzenia (xx, yy) może być następujący:

* Wyliczanie odległości od każdego Beaconu na podstawie siły sygnału RSSI.
* Korzystając z odległości d1d1​, d2d2​ i d3d3​ oraz współrzędnych Beaconów, można obliczyć lokalizację urządzenia (xx, yy) za pomocą trilateracji.

## Dodatkowe funkcjonalności

Największą wadą zaprezentowanego systemu jest to, że środowisko w którym będzie poruszał się pojazd musi być puste (w razie napotkania przeszkody sygnał wytraci moc i nie będzie możliwe określenie dokładnej lokalizacji). Jest to dobry punkt wyjścia do zastosowania dodatkowych systemów lokalizacyjnych, takich jak enkodery w kołach pojazdu i magnetometry. Pozycja pojazdu mogłaby być estymowana na podstawie tych trzech wartości. Zbierane w ten sposób dane mogą stanowić bazę pod przyszłe wykorzystanie sztucznej inteligencji (każda trasa pokonana przez pojazd może być zapisywana i stanowić dane do uczenia modelu, który byłby w stanie zoptymalizować wyniki). 

Przedstawione dodatkowe funkcjonalności są oczywiście opcjonalne. Najpierw chciałbym przetestować pracę robota w pustym środowisku, w oparciu wyłącznie o technologię Beaconów. 

## Źródła

* Co to jest RTL: Jak działa technologia systemu lokalizacji w czasie rzeczywistym - https://www.mokosmart.com/pl/what-is-rtls-how-real-time-location-system-technology-works/
* Gravity - BLE Sensor Beacon - moduł Bluetooth - 5szt. - DFRobot TEL0149 - https://botland.com.pl/moduly-bluetooth/22462-gravity-ble-sensor-beacon-modul-bluetooth-5szt-dfrobot-tel0149-6959420923076.html
* Dokumentacja Arduino BLE - https://github.com/arduino-libraries/ArduinoBLE/blob/master/docs/api.md
* Strona producenta MokoSmart - https://www.mokosmart.com/pl/bluetooth-beacons/