const products = [
  {
    "id": "monopoly",
    "name": "Монополия",
    "category": "family",
    "price": 2990,
    "players": "2–8",
    "minutes": "60–180",
    "age": "8",
    "description": "Покупайте улицы, стройте дома и собирайте ренту в классической игре о недвижимости."
  },
  {
    "id": "uno",
    "name": "UNO",
    "category": "party",
    "price": 790,
    "players": "2–10",
    "minutes": "15–30",
    "age": "7",
    "description": "Сбрасывайте карты по цвету или числу и не забудьте сказать «Уно!»."
  },
  {
    "id": "munchkin",
    "name": "Манчкин",
    "category": "party",
    "price": 1790,
    "players": "3–6",
    "minutes": "60–90",
    "age": "12",
    "description": "Спускайтесь в подземелье, собирайте сокровища и первым доберитесь до десятого уровня."
  },
  {
    "id": "ticket-to-ride",
    "name": "Ticket to Ride: Европа",
    "category": "family",
    "price": 4290,
    "players": "2–5",
    "minutes": "30–60",
    "age": "8",
    "description": "Соединяйте города Европы железнодорожными маршрутами, стройте тоннели и пользуйтесь паромами."
  },
  {
    "id": "bang",
    "name": "Бэнг!",
    "category": "party",
    "price": 1690,
    "players": "4–7",
    "minutes": "20–40",
    "age": "8",
    "description": "В салуне Дикого Запада шериф, бандиты и ренегат преследуют разные цели."
  },
  {
    "id": "exploding-kittens",
    "name": "Взрывные котята",
    "category": "party",
    "price": 1490,
    "players": "2–5",
    "minutes": "15",
    "age": "7",
    "description": "Рискните вытянуть карту или отложите свой ход: главное — не встретить котёнка без обезвреживания."
  },
  {
    "id": "monopoly-deal",
    "name": "Монополия: Сделка",
    "category": "party",
    "price": 890,
    "players": "2–5",
    "minutes": "15–25",
    "age": "8",
    "description": "Соберите три комплекта недвижимости и помешайте соперникам завершить свои сделки."
  },
  {
    "id": "monopoly-junior",
    "name": "Монополия Junior",
    "category": "family",
    "price": 2290,
    "players": "2–4",
    "minutes": "20–40",
    "age": "5",
    "description": "Упрощённая «Монополия» с короткими партиями и понятными правилами для детей."
  },
  {
    "id": "munchkin-2",
    "name": "Манчкин 2: Дикий топор",
    "category": "expansions",
    "price": 1190,
    "players": "3–6",
    "minutes": "60–90",
    "age": "12",
    "description": "Орки, новые монстры и сокровища для классического «Манчкина». Требуется базовая игра."
  },
  {
    "id": "munchkin-3",
    "name": "Манчкин 3: Клирические ошибки",
    "category": "expansions",
    "price": 1190,
    "players": "3–6",
    "minutes": "60–90",
    "age": "12",
    "description": "Новые классы, монстры и снаряжение для подземелий. Требуется базовая игра."
  },
  {
    "id": "ticket-to-ride-usa",
    "name": "Ticket to Ride",
    "category": "family",
    "price": 3990,
    "players": "2–5",
    "minutes": "30–60",
    "age": "8",
    "description": "Стройте железнодорожные маршруты между городами Северной Америки."
  },
  {
    "id": "ticket-to-ride-ny",
    "name": "Ticket to Ride: Нью-Йорк",
    "category": "family",
    "price": 2490,
    "players": "2–4",
    "minutes": "10–15",
    "age": "8",
    "description": "Быстрая поездка по Манхэттену на жёлтых такси."
  },
  {
    "id": "catan",
    "name": "Колонизаторы",
    "category": "strategy",
    "price": 3990,
    "players": "3–4",
    "minutes": "60–120",
    "age": "10",
    "description": "Осваивайте остров: обменивайтесь ресурсами, стройте дороги и основывайте поселения."
  },
  {
    "id": "carcassonne",
    "name": "Каркассон",
    "category": "family",
    "price": 2790,
    "players": "2–5",
    "minutes": "30–45",
    "age": "7",
    "description": "Соберите средневековый ландшафт из тайлов и разместите своих подданных."
  },
  {
    "id": "azul",
    "name": "Азул",
    "category": "strategy",
    "price": 3890,
    "players": "2–4",
    "minutes": "30–45",
    "age": "8",
    "description": "Подбирайте цветные плитки и составляйте мозаичный узор."
  },
  {
    "id": "dixit",
    "name": "Диксит",
    "category": "party",
    "price": 3290,
    "players": "3–6",
    "minutes": "30",
    "age": "8",
    "description": "Придумывайте ассоциации к иллюстрациям и угадывайте карту рассказчика."
  },
  {
    "id": "codenames",
    "name": "Кодовые имена",
    "category": "party",
    "price": 1990,
    "players": "2–8",
    "minutes": "15–30",
    "age": "10",
    "description": "Дайте своей команде подсказку одним словом, чтобы она нашла нужные карточки."
  },
  {
    "id": "pandemic",
    "name": "Пандемия",
    "category": "strategy",
    "price": 3490,
    "players": "2–4",
    "minutes": "45",
    "age": "8",
    "description": "Распределите роли и действуйте сообща, чтобы сдержать вспышки болезней."
  },
  {
    "id": "splendor",
    "name": "Роскошь",
    "category": "strategy",
    "price": 3190,
    "players": "2–4",
    "minutes": "30",
    "age": "10",
    "description": "Обменивайте жетоны драгоценностей на карты и привлекайте покровителей."
  },
  {
    "id": "seven-wonders",
    "name": "7 чудес",
    "category": "strategy",
    "price": 4190,
    "players": "2–7",
    "minutes": "30",
    "age": "10",
    "description": "Развивайте свой город на протяжении трёх эпох и постройте чудо света."
  },
  {
    "id": "love-letter",
    "name": "Тайное послание",
    "category": "party",
    "price": 990,
    "players": "2–4",
    "minutes": "20",
    "age": "10",
    "description": "Передайте письмо через придворных, угадывая, кто остался в игре."
  },
  {
    "id": "saboteur",
    "name": "Саботёр",
    "category": "party",
    "price": 1090,
    "players": "3–10",
    "minutes": "30",
    "age": "8",
    "description": "Прокладывайте туннели к золоту и вычисляйте тех, кто пытается сорвать работу."
  },
  {
    "id": "santorini",
    "name": "Санторини",
    "category": "strategy",
    "price": 3390,
    "players": "2–4",
    "minutes": "20",
    "age": "8",
    "description": "Стройте башни и поднимитесь на третий этаж раньше соперника."
  },
  {
    "id": "quacks",
    "name": "Шарлатаны из Кведлинбурга",
    "category": "family",
    "price": 3790,
    "players": "2–4",
    "minutes": "45",
    "age": "10",
    "description": "Варите зелья, вытягивая ингредиенты из мешка. Остановитесь до того, как котёл взорвётся."
  },
  {
    "id": "playing-cards",
    "name": "Игральные карты Bicycle Rider Back",
    "category": "classic",
    "price": 590,
    "players": "1–6",
    "minutes": "15–60",
    "age": "6",
    "description": "Классическая колода из 52 карт с двумя джокерами для карточных игр и фокусов."
  }
];
