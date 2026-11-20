/* Упражнения к темам: задача, подсказка и скрытое решение. */
window.GO_ROADMAP_EXERCISES = {
  "prep:0": [
    {
      "title": "Найти main-функции",
      "task": "В проекте много .go файлов. Напишите команду, которая рекурсивно найдёт только строки с объявлением func main.",
      "hint": "grep умеет фильтровать файлы по маске через --include.",
      "solution": "grep -R --include=\"*.go\" -n \"func main\" .",
      "starter": "",
      "code": false,
      "lang": "bash"
    },
    {
      "title": "Переменная только для процесса",
      "task": "Запустите программу с APP_ENV=dev, не меняя код и не экспортируя переменную в текущий shell. Как проверить, что дочерний процесс её видит?",
      "hint": "Переменную можно поставить перед командой. В Go её читает os.Getenv.",
      "solution": "APP_ENV=dev go run .\n\n# в коде:\n# fmt.Println(os.Getenv(\"APP_ENV\"))",
      "starter": "",
      "code": false,
      "lang": "bash"
    }
  ],
  "prep:1": [
    {
      "title": "Ветка и слияние",
      "task": "Создайте ветку feature, сделайте в ней коммит и влейте её в main. Запишите последовательность команд.",
      "hint": "switch -c создаёт ветку, merge вливает её в текущую.",
      "solution": "git switch -c feature\ngit add .\ngit commit -m \"add feature\"\ngit switch main\ngit merge feature",
      "starter": "",
      "code": false,
      "lang": "bash"
    },
    {
      "title": "Отменить коммит, сохранив файлы",
      "task": "Вы закоммитили лишнее и хотите убрать коммит, но оставить изменения в рабочей папке. Какая команда нужна?",
      "hint": "reset --soft двигает HEAD, не трогая индекс и рабочую папку.",
      "solution": "git reset --soft HEAD~1",
      "starter": "",
      "code": false,
      "lang": "bash"
    }
  ],
  "prep:2": [
    {
      "title": "Создание ресурса",
      "task": "Клиент отправляет JSON с новым заказом. Выберите метод, статус успешного ответа и заголовок, который подскажет URL созданного ресурса.",
      "hint": "Создание — это POST. Успех с новым ресурсом — 201.",
      "solution": "POST /orders HTTP/1.1\nContent-Type: application/json\n\nHTTP/1.1 201 Created\nLocation: /orders/42",
      "starter": "",
      "code": false,
      "lang": "http"
    },
    {
      "title": "Диагностика 401 и 403",
      "task": "Запрос возвращает 403, хотя токен передан. Что это значит и чем ситуация отличалась бы при 401?",
      "hint": "401 — клиент не аутентифицирован. 403 — аутентифицирован, но нет прав.",
      "solution": "401: токена нет или он неверный — нужно войти заново.\n403: пользователь известен, но действие запрещено — менять права бесполезно, нужен другой аккаунт или разрешение.",
      "starter": "",
      "code": false,
      "lang": "http"
    }
  ],
  "prep:3": [
    {
      "title": "Пользователи без заказов",
      "task": "Напишите запрос: все пользователи, у которых ещё нет ни одного заказа. Нужны id и имя.",
      "hint": "LEFT JOIN даёт NULL в правой таблице, если совпадений нет.",
      "solution": "SELECT u.id, u.name\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE o.id IS NULL;",
      "starter": "",
      "code": false,
      "lang": "sql"
    },
    {
      "title": "Выручка по дням",
      "task": "Посчитайте количество заказов и сумму amount по каждому дню. Оставьте только дни, где сумма больше 1000.",
      "hint": "GROUP BY по дате, агрегаты, затем HAVING для групп.",
      "solution": "SELECT date(created_at) AS day,\n       COUNT(*) AS orders,\n       SUM(amount) AS revenue\nFROM orders\nGROUP BY day\nHAVING SUM(amount) > 1000\nORDER BY day;",
      "starter": "",
      "code": false,
      "lang": "sql"
    }
  ],
  "basics:0": [
    {
      "title": "Первый модуль",
      "task": "Создайте модуль example.com/hello и программу, которая печатает версию Go из runtime.Version(). Запишите команды и код.",
      "hint": "go mod init создаёт go.mod. Пакет main и функция main обязательны.",
      "solution": "go mod init example.com/hello\n\n// main.go\npackage main\n\nimport (\n    \"fmt\"\n    \"runtime\"\n)\n\nfunc main() {\n    fmt.Println(\"Go:\", runtime.Version())\n}",
      "starter": "",
      "code": false,
      "lang": "bash"
    },
    {
      "title": "Что делают команды",
      "task": "Сопоставьте: go mod tidy, go vet, go test -race, gofmt -w. Что каждая делает?",
      "hint": "tidy — зависимости, vet — подозрительный код, race — гонки, gofmt — форматирование.",
      "solution": "go mod tidy — добавляет недостающие и удаляет лишние зависимости.\ngo vet — ищет подозрительные конструкции, которые пропускает компилятор.\ngo test -race — запускает тесты с детектором гонок данных.\ngofmt -w — переформатирует файлы на месте.",
      "starter": "",
      "code": false,
      "lang": "bash"
    }
  ],
  "basics:1": [
    {
      "title": "Байты и руны",
      "task": "Напишите функцию Describe(s string) (bytes, runes int), которая возвращает длину строки в байтах и количество Unicode-символов.",
      "hint": "len(s) — байты. Для рун есть utf8.RuneCountInString.",
      "solution": "package main\n\nimport (\n    \"fmt\"\n    \"unicode/utf8\"\n)\n\nfunc Describe(s string) (int, int) {\n    return len(s), utf8.RuneCountInString(s)\n}\n\nfunc main() {\n    fmt.Println(Describe(\"Go\"))     // 2 2\n    fmt.Println(Describe(\"Привет\")) // 12 6\n}",
      "starter": "package main\n\nimport (\n    \"fmt\"\n    \"unicode/utf8\"\n)\n\nfunc Describe(s string) (int, int) {\n    // TODO: верните байты и руны\n    return 0, 0\n}\n\nfunc main() {\n    fmt.Println(Describe(\"Go\"))     // 2 2\n    fmt.Println(Describe(\"Привет\")) // 12 6\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Нулевые значения",
      "task": "Что напечатает программа? Объясните каждое значение.\n\nvar i int\nvar s string\nvar b bool\nvar p *int\nfmt.Printf(\"%d %q %v %v\\n\", i, s, b, p)",
      "hint": "В Go все переменные инициализируются нулевым значением своего типа.",
      "solution": "0 \"\" false <nil>\n\nЧисла — 0, строка — пустая, bool — false, указатель — nil.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "basics:2": [
    {
      "title": "FizzBuzz",
      "task": "Напишите FizzBuzz(n int) []string: числа от 1 до n, но кратные 3 — Fizz, кратные 5 — Buzz, кратные 15 — FizzBuzz.",
      "hint": "Сначала проверяйте делимость на 15, иначе ветки пересекутся.",
      "solution": "package main\n\nimport (\n    \"fmt\"\n    \"strconv\"\n)\n\nfunc FizzBuzz(n int) []string {\n    out := make([]string, 0, n)\n    for i := 1; i <= n; i++ {\n        switch {\n        case i%15 == 0:\n            out = append(out, \"FizzBuzz\")\n        case i%3 == 0:\n            out = append(out, \"Fizz\")\n        case i%5 == 0:\n            out = append(out, \"Buzz\")\n        default:\n            out = append(out, strconv.Itoa(i))\n        }\n    }\n    return out\n}\n\nfunc main() {\n    fmt.Println(FizzBuzz(15))\n}",
      "starter": "package main\n\nimport \"fmt\"\n\nfunc FizzBuzz(n int) []string {\n    // TODO\n    return nil\n}\n\nfunc main() {\n    fmt.Println(FizzBuzz(15))\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Предскажите вывод",
      "task": "Что напечатает код и почему?\n\nfor i := 0; i < 3; i++ {\n    defer fmt.Println(i)\n}",
      "hint": "defer выполняются после выхода из функции в обратном порядке.",
      "solution": "2\n1\n0\n\nОтложенные вызовы идут LIFO, но аргумент i вычисляется в момент defer, поэтому печатаются разные значения.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "basics:3": [
    {
      "title": "Деление с ошибкой",
      "task": "Напишите DivMod(a, b int) (q, r int, err error). При b == 0 верните понятную ошибку, иначе частное и остаток.",
      "hint": "Создайте ошибку через errors.New или fmt.Errorf.",
      "solution": "package main\n\nimport (\n    \"errors\"\n    \"fmt\"\n)\n\nfunc DivMod(a, b int) (int, int, error) {\n    if b == 0 {\n        return 0, 0, errors.New(\"division by zero\")\n    }\n    return a / b, a % b, nil\n}\n\nfunc main() {\n    q, r, err := DivMod(7, 3)\n    fmt.Println(q, r, err)\n    _, _, err = DivMod(1, 0)\n    fmt.Println(err)\n}",
      "starter": "package main\n\nimport \"fmt\"\n\nfunc DivMod(a, b int) (int, int, error) {\n    // TODO\n    return 0, 0, nil\n}\n\nfunc main() {\n    fmt.Println(DivMod(7, 3))\n    fmt.Println(DivMod(1, 0))\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Два независимых счётчика",
      "task": "Напишите Counter() func() int, которая возвращает замыкание-счётчик. Два вызова Counter() должны считать независимо.",
      "hint": "Замыкание захватывает переменную из внешней функции.",
      "solution": "package main\n\nimport \"fmt\"\n\nfunc Counter() func() int {\n    n := 0\n    return func() int {\n        n++\n        return n\n    }\n}\n\nfunc main() {\n    a := Counter()\n    b := Counter()\n    fmt.Println(a(), a(), b()) // 1 2 1\n}",
      "starter": "package main\n\nimport \"fmt\"\n\nfunc Counter() func() int {\n    // TODO: верните замыкание\n    return func() int { return 0 }\n}\n\nfunc main() {\n    a := Counter()\n    b := Counter()\n    fmt.Println(a(), a(), b())\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "basics:4": [
    {
      "title": "Уникальные элементы",
      "task": "Напишите Unique(nums []int) []int: уберите повторы, сохранив порядок первого появления.",
      "hint": "map для проверки, отдельный слайс для результата.",
      "solution": "package main\n\nimport \"fmt\"\n\nfunc Unique(nums []int) []int {\n    seen := make(map[int]bool, len(nums))\n    out := make([]int, 0, len(nums))\n    for _, n := range nums {\n        if seen[n] {\n            continue\n        }\n        seen[n] = true\n        out = append(out, n)\n    }\n    return out\n}\n\nfunc main() {\n    fmt.Println(Unique([]int{3, 1, 3, 2, 1})) // [3 1 2]\n}",
      "starter": "package main\n\nimport \"fmt\"\n\nfunc Unique(nums []int) []int {\n    // TODO\n    return nil\n}\n\nfunc main() {\n    fmt.Println(Unique([]int{3, 1, 3, 2, 1}))\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Общий массив",
      "task": "Что напечатает код?\n\na := []int{1, 2, 3}\nb := a[:2]\nb = append(b, 99)\nfmt.Println(a, b)",
      "hint": "append пишет в тот же массив, если хватает ёмкости.",
      "solution": "a: [1 2 99], b: [1 2 99]\n\nb использует массив a, у него достаточно ёмкости, поэтому append перезаписал a[2]. Если бы ёмкости не хватило, append выделил бы новый массив.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "basics:5": [
    {
      "title": "Банковский счёт",
      "task": "Опишите структуру Account с балансом и методами Deposit(amount int) и Withdraw(amount int) error. Запретите отрицательный баланс и суммы <= 0.",
      "hint": "Методы с получателем-указателем меняют структуру.",
      "solution": "package main\n\nimport (\n    \"errors\"\n    \"fmt\"\n)\n\ntype Account struct {\n    Balance int\n}\n\nfunc (a *Account) Deposit(amount int) error {\n    if amount <= 0 {\n        return errors.New(\"amount must be positive\")\n    }\n    a.Balance += amount\n    return nil\n}\n\nfunc (a *Account) Withdraw(amount int) error {\n    if amount <= 0 {\n        return errors.New(\"amount must be positive\")\n    }\n    if amount > a.Balance {\n        return errors.New(\"insufficient funds\")\n    }\n    a.Balance -= amount\n    return nil\n}\n\nfunc main() {\n    acc := &Account{}\n    _ = acc.Deposit(100)\n    _ = acc.Withdraw(30)\n    fmt.Println(acc.Balance) // 70\n}",
      "starter": "package main\n\nimport \"fmt\"\n\ntype Account struct {\n    Balance int\n}\n\nfunc (a *Account) Deposit(amount int) error {\n    // TODO\n    return nil\n}\n\nfunc (a *Account) Withdraw(amount int) error {\n    // TODO\n    return nil\n}\n\nfunc main() {\n    acc := &Account{}\n    _ = acc.Deposit(100)\n    _ = acc.Withdraw(30)\n    fmt.Println(acc.Balance)\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Копия или оригинал",
      "task": "Что напечатает код?\n\ntype User struct{ Name string }\nfunc rename(u User) { u.Name = \"Bob\" }\nfunc renamePtr(u *User) { u.Name = \"Bob\" }\n\nu := User{Name: \"Ann\"}\nrename(u)\nfmt.Println(u.Name)\nrenamePtr(&u)\nfmt.Println(u.Name)",
      "hint": "Структура передаётся по значению, если не передать указатель.",
      "solution": "Ann\nBob\n\nrename работает с копией, renamePtr — с оригиналом.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "basics:6": [
    {
      "title": "Порядок команд модуля",
      "task": "Расставьте порядок: go mod init, go mod tidy, go build, go test. Что произойдёт, если пропустить tidy?",
      "hint": "Сначала модуль, потом зависимости, потом сборка и тесты.",
      "solution": "1. go mod init example.com/app\n2. добавьте импорты и выполните go mod tidy\n3. go build ./...\n4. go test ./...\n\nБез tidy в go.mod не будет нужных require, и сборка попросит добавить зависимости.",
      "starter": "",
      "code": false,
      "lang": "bash"
    },
    {
      "title": "Зачем internal",
      "task": "Почему пакет internal/store нельзя импортировать из другого модуля? Это ограничение компилятора или соглашение?",
      "hint": "internal — правило видимости, которое проверяет компилятор.",
      "solution": "Это ограничение компилятора: пакеты внутри internal доступны только коду из родительского каталога модуля. Внешний модуль получит ошибку импорта. Так скрывают реализацию, но внутри модуля пакет использовать можно.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "idiomatic:0": [
    {
      "title": "Фигуры через интерфейс",
      "task": "Опишите интерфейс Shape с методом Area() float64, структуры Rectangle и Circle и функцию TotalArea(shapes []Shape) float64.",
      "hint": "Интерфейс объявляется там, где используется. Методы реализуются неявно.",
      "solution": "package main\n\nimport (\n    \"fmt\"\n    \"math\"\n)\n\ntype Shape interface {\n    Area() float64\n}\n\ntype Rectangle struct{ W, H float64 }\n\nfunc (r Rectangle) Area() float64 { return r.W * r.H }\n\ntype Circle struct{ R float64 }\n\nfunc (c Circle) Area() float64 { return math.Pi * c.R * c.R }\n\nfunc TotalArea(shapes []Shape) float64 {\n    total := 0.0\n    for _, s := range shapes {\n        total += s.Area()\n    }\n    return total\n}\n\nfunc main() {\n    shapes := []Shape{Rectangle{W: 2, H: 3}, Circle{R: 1}}\n    fmt.Printf(\"%.2f\\n\", TotalArea(shapes))\n}",
      "starter": "package main\n\nimport (\n    \"fmt\"\n    \"math\"\n)\n\ntype Shape interface {\n    Area() float64\n}\n\ntype Rectangle struct{ W, H float64 }\n\ntype Circle struct{ R float64 }\n\nfunc TotalArea(shapes []Shape) float64 {\n    // TODO\n    return 0\n}\n\nfunc main() {\n    shapes := []Shape{Rectangle{W: 2, H: 3}, Circle{R: 1}}\n    fmt.Printf(\"%.2f\\n\", TotalArea(shapes))\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Ловушка nil-интерфейса",
      "task": "Что напечатает код?\n\ntype MyError struct{}\nfunc (e *MyError) Error() string { return \"boom\" }\n\nvar err error = (*MyError)(nil)\nfmt.Println(err == nil)\nif err != nil { fmt.Println(err) }",
      "hint": "Интерфейс хранит пару «динамический тип + значение».",
      "solution": "false\nboom\n\nУказатель nil, но динамический тип *MyError известен, поэтому интерфейс не равен nil. Вызов Error() на nil-получателе здесь безопасен, но в других методах это частая паника.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "idiomatic:1": [
    {
      "title": "Ошибка с контекстом",
      "task": "Напишите ParseAge(s string) (int, error). Для нечислового значения верните ErrInvalidAge через %w с исходной ошибкой и проверьте результат через errors.Is.",
      "hint": "Sentinel-ошибка + fmt.Errorf(\"parse age %q: %w\", s, err).",
      "solution": "package main\n\nimport (\n    \"errors\"\n    \"fmt\"\n    \"strconv\"\n)\n\nvar ErrInvalidAge = errors.New(\"invalid age\")\n\nfunc ParseAge(s string) (int, error) {\n    n, err := strconv.Atoi(s)\n    if err != nil {\n        return 0, fmt.Errorf(\"parse age %q: %w\", s, ErrInvalidAge)\n    }\n    if n < 0 || n > 150 {\n        return 0, fmt.Errorf(\"age %d: %w\", n, ErrInvalidAge)\n    }\n    return n, nil\n}\n\nfunc main() {\n    _, err := ParseAge(\"abc\")\n    fmt.Println(err)\n    fmt.Println(errors.Is(err, ErrInvalidAge))\n}",
      "starter": "package main\n\nimport (\n    \"errors\"\n    \"fmt\"\n    \"strconv\"\n)\n\nvar ErrInvalidAge = errors.New(\"invalid age\")\n\nfunc ParseAge(s string) (int, error) {\n    // TODO: используйте strconv и %w\n    return 0, nil\n}\n\nfunc main() {\n    _, err := ParseAge(\"abc\")\n    fmt.Println(err)\n    fmt.Println(errors.Is(err, ErrInvalidAge))\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "%v или %w",
      "task": "Чем опасен fmt.Errorf(\"load: %v\", err) вместо %w? Как это влияет на errors.Is?",
      "hint": "%v теряет цепочку ошибок.",
      "solution": "С %v текст ошибки сохраняется, но обёртка не создаётся. errors.Is и errors.As не смогут найти исходную ошибку, поэтому решение будет зависеть только от строки. Для сохранения цепочки нужен %w.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "idiomatic:2": [
    {
      "title": "Безопасное деление",
      "task": "Напишите SafeDiv(a, b int) (result int, err error), которая возвращает ошибку вместо паники при b == 0, используя recover.",
      "hint": "recover работает только внутри defer. Результат меняйте через именованный возврат.",
      "solution": "package main\n\nimport (\n    \"fmt\"\n)\n\nfunc SafeDiv(a, b int) (result int, err error) {\n    defer func() {\n        if r := recover(); r != nil {\n            err = fmt.Errorf(\"recovered: %v\", r)\n        }\n    }()\n    return a / b, nil\n}\n\nfunc main() {\n    fmt.Println(SafeDiv(10, 2))\n    fmt.Println(SafeDiv(1, 0))\n}",
      "starter": "package main\n\nimport \"fmt\"\n\nfunc SafeDiv(a, b int) (result int, err error) {\n    // TODO: defer + recover\n    return a / b, nil\n}\n\nfunc main() {\n    fmt.Println(SafeDiv(10, 2))\n    fmt.Println(SafeDiv(1, 0))\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Порядок defer",
      "task": "Что напечатает код и почему?\n\nfunc f() {\n    defer fmt.Println(\"first\")\n    defer fmt.Println(\"second\")\n    fmt.Println(\"body\")\n}",
      "hint": "defer выполняются после тела функции в обратном порядке.",
      "solution": "body\nsecond\nfirst\n\nОтложенные вызовы складываются в стек: последний объявленный выполняется первым.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "idiomatic:3": [
    {
      "title": "Табличный тест",
      "task": "Напишите TestAdd в файле add_test.go: три случая, t.Run и проверка результата. Функция Add(a, b int) int уже есть.",
      "hint": "Слайс структур с name, a, b, want; внутри цикл и t.Run.",
      "solution": "package main\n\nimport \"testing\"\n\nfunc TestAdd(t *testing.T) {\n    cases := []struct {\n        name string\n        a, b int\n        want int\n    }{\n        {\"positive\", 2, 3, 5},\n        {\"zero\", 0, 7, 7},\n        {\"negative\", -2, 1, -1},\n    }\n    for _, tc := range cases {\n        t.Run(tc.name, func(t *testing.T) {\n            if got := Add(tc.a, tc.b); got != tc.want {\n                t.Fatalf(\"Add(%d, %d) = %d, want %d\", tc.a, tc.b, got, tc.want)\n            }\n        })\n    }\n}",
      "starter": "",
      "code": false,
      "lang": "go"
    },
    {
      "title": "Зачем t.Helper",
      "task": "В тесте есть вспомогательная функция check(t *testing.T, got, want int). Почему ей стоит вызвать t.Helper()?",
      "hint": "Это влияет на то, какую строку покажет testing при ошибке.",
      "solution": "t.Helper() помечает функцию как вспомогательную. Тогда при t.Errorf testing покажет строку вызова check в тесте, а не внутреннюю строку помощника. Отладка становится точнее.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "idiomatic:4": [
    {
      "title": "Частоты слов",
      "task": "Напишите WordFreq(s string) map[string]int: разбейте строку на слова через strings.Fields, приведите к нижнему регистру и посчитайте частоты.",
      "hint": "strings.ToLower и map.",
      "solution": "package main\n\nimport (\n    \"fmt\"\n    \"strings\"\n)\n\nfunc WordFreq(s string) map[string]int {\n    freq := make(map[string]int)\n    for _, word := range strings.Fields(strings.ToLower(s)) {\n        freq[word]++\n    }\n    return freq\n}\n\nfunc main() {\n    fmt.Println(WordFreq(\"Go go GO gopher\"))\n}",
      "starter": "package main\n\nimport (\n    \"fmt\"\n    \"strings\"\n)\n\nfunc WordFreq(s string) map[string]int {\n    // TODO\n    return nil\n}\n\nfunc main() {\n    fmt.Println(WordFreq(\"Go go GO gopher\"))\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "JSON с тегами",
      "task": "Опишите структуру User с полями ID, Name, Email и тегами json. Сделайте поле Password невидимым для JSON и закодируйте пользователя в строку.",
      "hint": "Тег json:\"-\" исключает поле. json.Marshal возвращает []byte.",
      "solution": "package main\n\nimport (\n    \"encoding/json\"\n    \"fmt\"\n)\n\ntype User struct {\n    ID       int    `json:\"id\"`\n    Name     string `json:\"name\"`\n    Email    string `json:\"email\"`\n    Password string `json:\"-\"`\n}\n\nfunc main() {\n    u := User{ID: 1, Name: \"Ann\", Email: \"a@b.c\", Password: \"secret\"}\n    data, err := json.Marshal(u)\n    fmt.Println(string(data), err)\n}",
      "starter": "package main\n\nimport (\n    \"encoding/json\"\n    \"fmt\"\n)\n\ntype User struct {\n    ID       int\n    Name     string\n    Email    string\n    Password string\n}\n\nfunc main() {\n    u := User{ID: 1, Name: \"Ann\", Email: \"a@b.c\", Password: \"secret\"}\n    data, err := json.Marshal(u)\n    fmt.Println(string(data), err)\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "idiomatic:5": [
    {
      "title": "Map и Filter",
      "task": "Напишите дженерики Map[T, U any]([]T, func(T) U) []U и Filter[T any]([]T, func(T) bool) []T. Проверьте на []int.",
      "hint": "Параметры типов указываются в квадратных скобках после имени функции.",
      "solution": "package main\n\nimport \"fmt\"\n\nfunc Map[T, U any](items []T, f func(T) U) []U {\n    out := make([]U, 0, len(items))\n    for _, item := range items {\n        out = append(out, f(item))\n    }\n    return out\n}\n\nfunc Filter[T any](items []T, keep func(T) bool) []T {\n    out := make([]T, 0, len(items))\n    for _, item := range items {\n        if keep(item) {\n            out = append(out, item)\n        }\n    }\n    return out\n}\n\nfunc main() {\n    nums := []int{1, 2, 3, 4}\n    doubled := Map(nums, func(n int) int { return n * 2 })\n    evens := Filter(doubled, func(n int) bool { return n%4 == 0 })\n    fmt.Println(doubled, evens)\n}",
      "starter": "package main\n\nimport \"fmt\"\n\nfunc Map[T, U any](items []T, f func(T) U) []U {\n    // TODO\n    return nil\n}\n\nfunc Filter[T any](items []T, keep func(T) bool) []T {\n    // TODO\n    return nil\n}\n\nfunc main() {\n    nums := []int{1, 2, 3, 4}\n    doubled := Map(nums, func(n int) int { return n * 2 })\n    evens := Filter(doubled, func(n int) bool { return n%4 == 0 })\n    fmt.Println(doubled, evens)\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Ограничения типов",
      "task": "Чем any отличается от comparable и от ~int? Приведите пример, где any недостаточно.",
      "hint": "any разрешает всё, comparable — сравнение ==, ~int — базовый тип int.",
      "solution": "any не даёт никаких операций, кроме хранения. comparable разрешает == и !=, например для поиска в map. ~int разрешает int и пользовательские типы с базовым int, поэтому с ним можно складывать и сравнивать числа. Для суммы нужен числовой constraint, а не any.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "concurrency:0": [
    {
      "title": "Три воркера",
      "task": "Запустите три горутины, каждая печатает свой номер. Дождитесь всех через sync.WaitGroup.",
      "hint": "wg.Add(1) до запуска горутины, defer wg.Done() внутри, wg.Wait() снаружи.",
      "solution": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc main() {\n    var wg sync.WaitGroup\n    for i := 1; i <= 3; i++ {\n        wg.Add(1)\n        go func(n int) {\n            defer wg.Done()\n            fmt.Println(\"worker\", n)\n        }(i)\n    }\n    wg.Wait()\n    fmt.Println(\"done\")\n}",
      "starter": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc main() {\n    var wg sync.WaitGroup\n    for i := 1; i <= 3; i++ {\n        // TODO: добавьте счётчик и горутину\n    }\n    wg.Wait()\n    fmt.Println(\"done\")\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Замыкание в цикле",
      "task": "Что может напечатать код и как исправить его надёжно?\n\nfor _, v := range []string{\"a\", \"b\", \"c\"} {\n    go func() { fmt.Println(v) }()\n}",
      "hint": "В старых версиях Go переменная цикла была общей. Передайте значение параметром.",
      "solution": "До Go 1.22 горутины могли напечатать одно и то же значение, чаще всего последнее. Надёжный вариант:\n\nfor _, v := range items {\n    go func(s string) { fmt.Println(s) }(v)\n}\n\nВ Go 1.22+ переменная цикла создаётся заново на каждой итерации, но явная передача параметра остаётся понятной.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "concurrency:1": [
    {
      "title": "Квадраты через канал",
      "task": "Напишите функцию Squares(nums []int) <-chan int: горутина отправляет квадраты, закрывает канал и не блокируется навсегда.",
      "hint": "Закрывает канал отправитель. Получатель читает через range.",
      "solution": "package main\n\nimport \"fmt\"\n\nfunc Squares(nums []int) <-chan int {\n    out := make(chan int)\n    go func() {\n        defer close(out)\n        for _, n := range nums {\n            out <- n * n\n        }\n    }()\n    return out\n}\n\nfunc main() {\n    for sq := range Squares([]int{1, 2, 3}) {\n        fmt.Println(sq)\n    }\n}",
      "starter": "package main\n\nimport \"fmt\"\n\nfunc Squares(nums []int) <-chan int {\n    out := make(chan int)\n    go func() {\n        // TODO: отправьте квадраты и закройте канал\n    }()\n    return out\n}\n\nfunc main() {\n    for sq := range Squares([]int{1, 2, 3}) {\n        fmt.Println(sq)\n    }\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Кто закрывает канал",
      "task": "У канала два отправителя и один получатель. Кто должен вызвать close и почему нельзя закрывать на стороне получателя?",
      "hint": "Закрытие — сигнал «больше значений не будет» от отправителей.",
      "solution": "Закрывать должен координатор после завершения всех отправителей, а не получатель. Получатель не знает, будут ли ещё отправки; если он закроет канал, отправитель может запаниковать при записи. При нескольких отправителях используют WaitGroup и отдельную горутину, которая ждёт их и вызывает close.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "concurrency:2": [
    {
      "title": "Таймаут",
      "task": "Напишите функцию WaitMsg(ch <-chan string) (string, error): ждите сообщение не дольше двух секунд, иначе верните ошибку.",
      "hint": "select с двумя case: канал и time.After.",
      "solution": "package main\n\nimport (\n    \"errors\"\n    \"fmt\"\n    \"time\"\n)\n\nfunc WaitMsg(ch <-chan string) (string, error) {\n    select {\n    case msg := <-ch:\n        return msg, nil\n    case <-time.After(2 * time.Second):\n        return \"\", errors.New(\"timeout\")\n    }\n}\n\nfunc main() {\n    ch := make(chan string, 1)\n    ch <- \"ok\"\n    fmt.Println(WaitMsg(ch))\n}",
      "starter": "package main\n\nimport (\n    \"errors\"\n    \"fmt\"\n    \"time\"\n)\n\nfunc WaitMsg(ch <-chan string) (string, error) {\n    // TODO: select + time.After\n    return \"\", errors.New(\"not implemented\")\n}\n\nfunc main() {\n    ch := make(chan string, 1)\n    ch <- \"ok\"\n    fmt.Println(WaitMsg(ch))\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Неблокирующая проверка",
      "task": "Как проверить канал, не блокируясь, если в нём нет значения? Напишите фрагмент с select и default.",
      "hint": "default выполняется сразу, если ни один case не готов.",
      "solution": "select {\ncase v := <-ch:\n    fmt.Println(\"got\", v)\ndefault:\n    fmt.Println(\"empty\")\n}",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "concurrency:3": [
    {
      "title": "Счётчик с Mutex",
      "task": "Запустите 100 горутин, каждая увеличивает общий total на 1. Защитите критическую секцию sync.Mutex и выведите итог.",
      "hint": "defer mu.Unlock() защищает от забытой разблокировки.",
      "solution": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc main() {\n    var (\n        mu    sync.Mutex\n        total int\n        wg    sync.WaitGroup\n    )\n    for i := 0; i < 100; i++ {\n        wg.Add(1)\n        go func() {\n            defer wg.Done()\n            mu.Lock()\n            total++\n            mu.Unlock()\n        }()\n    }\n    wg.Wait()\n    fmt.Println(total)\n}",
      "starter": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc main() {\n    var (\n        mu    sync.Mutex\n        total int\n        wg    sync.WaitGroup\n    )\n    for i := 0; i < 100; i++ {\n        wg.Add(1)\n        go func() {\n            defer wg.Done()\n            // TODO: защитите total\n            total++\n        }()\n    }\n    wg.Wait()\n    fmt.Println(total)\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Инициализация ровно один раз",
      "task": "Напишите loadConfig() string, который дорого вычисляется, но выполняется только один раз даже при вызове из нескольких горутин.",
      "hint": "sync.Once и пакетная переменная.",
      "solution": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nvar (\n    once   sync.Once\n    config string\n)\n\nfunc loadConfig() string {\n    once.Do(func() {\n        config = \"loaded\"\n    })\n    return config\n}\n\nfunc main() {\n    fmt.Println(loadConfig(), loadConfig())\n}",
      "starter": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nvar (\n    once   sync.Once\n    config string\n)\n\nfunc loadConfig() string {\n    // TODO: once.Do\n    return config\n}\n\nfunc main() {\n    fmt.Println(loadConfig(), loadConfig())\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "concurrency:4": [
    {
      "title": "Отменяемый воркер",
      "task": "Напишите worker(ctx context.Context, ch <-chan int), который читает ch, пока не отменён контекст, и завершается по ctx.Done().",
      "hint": "На каждой итерации select между ch и ctx.Done().",
      "solution": "package main\n\nimport (\n    \"context\"\n    \"fmt\"\n    \"time\"\n)\n\nfunc worker(ctx context.Context, ch <-chan int) {\n    for {\n        select {\n        case <-ctx.Done():\n            fmt.Println(\"stopped:\", ctx.Err())\n            return\n        case v := <-ch:\n            fmt.Println(\"got\", v)\n        }\n    }\n}\n\nfunc main() {\n    ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)\n    defer cancel()\n    ch := make(chan int)\n    go worker(ctx, ch)\n    ch <- 1\n    time.Sleep(100 * time.Millisecond)\n}",
      "starter": "package main\n\nimport (\n    \"context\"\n    \"fmt\"\n    \"time\"\n)\n\nfunc worker(ctx context.Context, ch <-chan int) {\n    // TODO: цикл с select\n}\n\nfunc main() {\n    ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)\n    defer cancel()\n    ch := make(chan int)\n    go worker(ctx, ch)\n    ch <- 1\n    time.Sleep(100 * time.Millisecond)\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Дедлайн операции",
      "task": "Оберните вызов slow() (int, error) в контекст с таймаутом 100 мс. Как узнать, что сработал именно дедлайн?",
      "hint": "ctx.Err() вернёт context.DeadlineExceeded.",
      "solution": "ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)\ndefer cancel()\n\nresult := make(chan int, 1)\ngo func() { v, _ := slow(); result <- v }()\n\nselect {\ncase v := <-result:\n    fmt.Println(v)\ncase <-ctx.Done():\n    fmt.Println(ctx.Err() == context.DeadlineExceeded)\n}",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "concurrency:5": [
    {
      "title": "Найдите утечку",
      "task": "Почему эта функция оставляет горутину навсегда?\n\nfunc f() {\n    ch := make(chan int)\n    go func() { ch <- 1 }()\n}",
      "hint": "Небуферизованная отправка ждёт получателя.",
      "solution": "Горутина блокируется на отправке в небуферизованный канал: получателя нет, функция завершилась. Варианты: буферизовать канал, добавить получателя или select с ctx.Done().",
      "starter": "",
      "code": false,
      "lang": "go"
    },
    {
      "title": "Почините гонку",
      "task": "Код ниже имеет гонку данных. Исправьте его через mutex и объясните, почему без синхронизации результат непредсказуем.\n\ntotal := 0\nfor i := 0; i < 100; i++ { go func() { total++ }() }",
      "hint": "Оберните total++ в Lock/Unlock и дождитесь горутин через WaitGroup.",
      "solution": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc main() {\n    var (\n        mu    sync.Mutex\n        total int\n        wg    sync.WaitGroup\n    )\n    for i := 0; i < 100; i++ {\n        wg.Add(1)\n        go func() {\n            defer wg.Done()\n            mu.Lock()\n            total++\n            mu.Unlock()\n        }()\n    }\n    wg.Wait()\n    fmt.Println(total)\n}",
      "starter": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc main() {\n    var (\n        mu    sync.Mutex\n        total int\n        wg    sync.WaitGroup\n    )\n    for i := 0; i < 100; i++ {\n        wg.Add(1)\n        go func() {\n            defer wg.Done()\n            // TODO: исправьте гонку\n            total++\n        }()\n    }\n    wg.Wait()\n    fmt.Println(total)\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "concurrency:6": [
    {
      "title": "Worker pool",
      "task": "Сделайте пул из трёх воркеров: они читают jobs, пишут результат в results и завершаются после close(jobs).",
      "hint": "WaitGroup для воркеров, отдельная горутина для закрытия results.",
      "solution": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {\n    defer wg.Done()\n    for j := range jobs {\n        results <- j * 2\n    }\n}\n\nfunc main() {\n    jobs := make(chan int, 10)\n    results := make(chan int, 10)\n    var wg sync.WaitGroup\n\n    for w := 1; w <= 3; w++ {\n        wg.Add(1)\n        go worker(w, jobs, results, &wg)\n    }\n    for i := 1; i <= 5; i++ {\n        jobs <- i\n    }\n    close(jobs)\n\n    go func() {\n        wg.Wait()\n        close(results)\n    }()\n\n    for r := range results {\n        fmt.Println(r)\n    }\n}",
      "starter": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {\n    defer wg.Done()\n    for j := range jobs {\n        results <- j * 2\n    }\n}\n\nfunc main() {\n    jobs := make(chan int, 10)\n    results := make(chan int, 10)\n    var wg sync.WaitGroup\n\n    // TODO: запустите 3 воркера, отправьте задачи и закройте jobs\n    // TODO: дождитесь воркеров и закройте results\n\n    for r := range results {\n        fmt.Println(r)\n    }\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Fan-in",
      "task": "Слейте два канала в один: функция Merge(a, b <-chan int) <-chan int должна вернуть канал, который закроется после закрытия обоих входов.",
      "hint": "На каждый вход отдельная горутина, WaitGroup и закрытие выходного канала.",
      "solution": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc Merge(a, b <-chan int) <-chan int {\n    out := make(chan int)\n    var wg sync.WaitGroup\n\n    forward := func(ch <-chan int) {\n        defer wg.Done()\n        for v := range ch {\n            out <- v\n        }\n    }\n\n    wg.Add(2)\n    go forward(a)\n    go forward(b)\n\n    go func() {\n        wg.Wait()\n        close(out)\n    }()\n    return out\n}\n\nfunc main() {\n    a := make(chan int, 2)\n    b := make(chan int, 2)\n    a <- 1\n    a <- 2\n    b <- 3\n    close(a)\n    close(b)\n    for v := range Merge(a, b) {\n        fmt.Println(v)\n    }\n}",
      "starter": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc Merge(a, b <-chan int) <-chan int {\n    out := make(chan int)\n    var wg sync.WaitGroup\n    // TODO\n    return out\n}\n\nfunc main() {\n    a := make(chan int, 2)\n    b := make(chan int, 2)\n    a <- 1\n    a <- 2\n    b <- 3\n    close(a)\n    close(b)\n    for v := range Merge(a, b) {\n        fmt.Println(v)\n    }\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "backend:0": [
    {
      "title": "Handler и httptest",
      "task": "Напишите handler для GET /health, который отвечает JSON {\"status\":\"ok\"} со статусом 200. Проверьте его через httptest.NewRecorder без запуска сервера.",
      "hint": "httptest.NewRequest(\"GET\", \"/health\", nil) и recorder.Result().",
      "solution": "package main\n\nimport (\n    \"fmt\"\n    \"net/http\"\n    \"net/http/httptest\"\n)\n\nfunc health(w http.ResponseWriter, r *http.Request) {\n    w.Header().Set(\"Content-Type\", \"application/json\")\n    w.WriteHeader(http.StatusOK)\n    fmt.Fprint(w, `{\"status\":\"ok\"}`)\n}\n\nfunc main() {\n    req := httptest.NewRequest(http.MethodGet, \"/health\", nil)\n    rec := httptest.NewRecorder()\n    health(rec, req)\n    fmt.Println(rec.Code, rec.Body.String())\n}",
      "starter": "package main\n\nimport (\n    \"fmt\"\n    \"net/http\"\n    \"net/http/httptest\"\n)\n\nfunc health(w http.ResponseWriter, r *http.Request) {\n    // TODO: JSON и статус 200\n}\n\nfunc main() {\n    req := httptest.NewRequest(http.MethodGet, \"/health\", nil)\n    rec := httptest.NewRecorder()\n    health(rec, req)\n    fmt.Println(rec.Code, rec.Body.String())\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Таймауты сервера",
      "task": "Зачем http.Server нужны ReadTimeout, WriteTimeout и IdleTimeout? Что будет, если их не задать?",
      "hint": "Без таймаутов медленный клиент удерживает соединение и ресурсы.",
      "solution": "ReadTimeout ограничивает чтение запроса, WriteTimeout — запись ответа, IdleTimeout — простой keep-alive соединения. Без них медленный или вредоносный клиент может держать соединения и память бесконечно (Slowloris, зависшие обработчики).",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "backend:1": [
    {
      "title": "Валидация JSON",
      "task": "Напишите handler createTask: декодируйте {\"title\":\"...\"}, верните 400 на битый JSON, 422 на пустой title и 201 с JSON при успехе. Проверьте через httptest.",
      "hint": "json.NewDecoder(r.Body).Decode, strings.TrimSpace, WriteHeader.",
      "solution": "package main\n\nimport (\n    \"encoding/json\"\n    \"fmt\"\n    \"net/http\"\n    \"net/http/httptest\"\n    \"strings\"\n)\n\nfunc createTask(w http.ResponseWriter, r *http.Request) {\n    var in struct {\n        Title string `json:\"title\"`\n    }\n    if err := json.NewDecoder(r.Body).Decode(&in); err != nil {\n        http.Error(w, \"invalid json\", http.StatusBadRequest)\n        return\n    }\n    if strings.TrimSpace(in.Title) == \"\" {\n        http.Error(w, \"title is required\", http.StatusUnprocessableEntity)\n        return\n    }\n    w.Header().Set(\"Content-Type\", \"application/json\")\n    w.WriteHeader(http.StatusCreated)\n    json.NewEncoder(w).Encode(map[string]any{\"id\": 1, \"title\": in.Title})\n}\n\nfunc main() {\n    req := httptest.NewRequest(http.MethodPost, \"/tasks\", strings.NewReader(`{\"title\":\"read\"}`))\n    rec := httptest.NewRecorder()\n    createTask(rec, req)\n    fmt.Println(rec.Code, rec.Body.String())\n}",
      "starter": "package main\n\nimport (\n    \"encoding/json\"\n    \"fmt\"\n    \"net/http\"\n    \"net/http/httptest\"\n    \"strings\"\n)\n\nfunc createTask(w http.ResponseWriter, r *http.Request) {\n    // TODO: decode, validate, 201\n}\n\nfunc main() {\n    req := httptest.NewRequest(http.MethodPost, \"/tasks\", strings.NewReader(`{\"title\":\"read\"}`))\n    rec := httptest.NewRecorder()\n    createTask(rec, req)\n    fmt.Println(rec.Code, rec.Body.String())\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Коды ответов",
      "task": "Выберите статусы: создан новый ресурс; клиент прислал битый JSON; ресурс не найден; пользователь вошёл, но нет прав; сервер упал.",
      "hint": "201, 400, 404, 403, 500.",
      "solution": "201 Created — создан ресурс.\n400 Bad Request — битый синтаксис запроса.\n404 Not Found — ресурса нет.\n403 Forbidden — прав нет.\n500 Internal Server Error — ошибка сервера.",
      "starter": "",
      "code": false,
      "lang": "http"
    }
  ],
  "backend:2": [
    {
      "title": "Параметры вместо склейки",
      "task": "Перепишите опасный запрос без конкатенации: \"SELECT id FROM users WHERE email = '\" + email + \"'\". Почему это важно?",
      "hint": "Placeholder $1 и передача аргумента отдельно.",
      "solution": "row := db.QueryRowContext(ctx, \"SELECT id FROM users WHERE email = $1\", email)\n\nСклейка строк открывает SQL-инъекцию. Драйвер передаёт значение отдельно от SQL, поэтому кавычки и комментарии в email не меняют запрос.",
      "starter": "",
      "code": false,
      "lang": "sql"
    },
    {
      "title": "Транзакция",
      "task": "Напишите функцию transfer(ctx, db, from, to int, amount int) error: списание и зачисление должны быть в одной транзакции с откатом при ошибке.",
      "hint": "BeginTx, defer tx.Rollback(), два ExecContext, Commit.",
      "solution": "func transfer(ctx context.Context, db *sql.DB, from, to, amount int) error {\n    tx, err := db.BeginTx(ctx, nil)\n    if err != nil {\n        return err\n    }\n    defer tx.Rollback()\n\n    if _, err := tx.ExecContext(ctx,\n        \"UPDATE accounts SET balance = balance - $1 WHERE id = $2\", amount, from); err != nil {\n        return err\n    }\n    if _, err := tx.ExecContext(ctx,\n        \"UPDATE accounts SET balance = balance + $1 WHERE id = $2\", amount, to); err != nil {\n        return err\n    }\n    return tx.Commit()\n}",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "backend:3": [
    {
      "title": "Env с дефолтом",
      "task": "Напишите env(key, fallback string) string: верните переменную окружения или запасное значение, если она пустая.",
      "hint": "os.Getenv возвращает пустую строку и для отсутствующей переменной.",
      "solution": "package main\n\nimport (\n    \"fmt\"\n    \"os\"\n)\n\nfunc env(key, fallback string) string {\n    if v := os.Getenv(key); v != \"\" {\n        return v\n    }\n    return fallback\n}\n\nfunc main() {\n    fmt.Println(env(\"APP_ENV\", \"dev\"))\n}",
      "starter": "package main\n\nimport (\n    \"fmt\"\n    \"os\"\n)\n\nfunc env(key, fallback string) string {\n    // TODO\n    return \"\"\n}\n\nfunc main() {\n    fmt.Println(env(\"APP_ENV\", \"dev\"))\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Структурированный лог",
      "task": "Создайте slog.Logger с JSON-обработчиком в stdout и запишите Info с полями port и env.",
      "hint": "slog.New(slog.NewJSONHandler(os.Stdout, opts)).",
      "solution": "package main\n\nimport (\n    \"log/slog\"\n    \"os\"\n)\n\nfunc main() {\n    logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{\n        Level: slog.LevelInfo,\n    }))\n    logger.Info(\"server started\", \"port\", 8080, \"env\", \"dev\")\n}",
      "starter": "package main\n\nimport (\n    \"log/slog\"\n    \"os\"\n)\n\nfunc main() {\n    // TODO: JSON handler и Info с полями\n    _ = logger\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "backend:4": [
    {
      "title": "Graceful shutdown",
      "task": "Напишите main: запустите http.Server в горутине, дождитесь SIGINT/SIGTERM через signal.NotifyContext и вызовите Shutdown с таймаутом 10 секунд.",
      "hint": "signal.NotifyContext, srv.ListenAndServe в горутине, srv.Shutdown(shutdownCtx).",
      "solution": "package main\n\nimport (\n    \"context\"\n    \"log\"\n    \"net/http\"\n    \"os\"\n    \"os/signal\"\n    \"syscall\"\n    \"time\"\n)\n\nfunc main() {\n    srv := &http.Server{Addr: \":8080\"}\n    ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)\n    defer stop()\n\n    go func() {\n        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {\n            log.Println(\"serve:\", err)\n        }\n    }()\n\n    <-ctx.Done()\n    shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)\n    defer cancel()\n    if err := srv.Shutdown(shutdownCtx); err != nil {\n        log.Println(\"shutdown:\", err)\n    }\n}",
      "starter": "package main\n\nimport (\n    \"context\"\n    \"log\"\n    \"net/http\"\n    \"os\"\n    \"os/signal\"\n    \"syscall\"\n    \"time\"\n)\n\nfunc main() {\n    srv := &http.Server{Addr: \":8080\"}\n    _ = srv\n    // TODO: signal.NotifyContext, ListenAndServe в горутине, Shutdown\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Почему не os.Exit",
      "task": "Почему при graceful shutdown нельзя сразу вызывать os.Exit(0)? Что не успеет выполниться?",
      "hint": "os.Exit не запускает defer.",
      "solution": "os.Exit завершает процесс немедленно и не выполняет отложенные функции: не закроются БД и файлы, не сбросятся буферы логов, не завершатся текущие запросы. Сначала Shutdown и закрытие ресурсов, потом выход.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "backend:5": [
    {
      "title": "Multi-stage Dockerfile",
      "task": "Напишите Dockerfile для Go-сервиса: сборка в golang:1.23, финальный образ distroless/static, только бинарник.",
      "hint": "Первый FROM AS build, CGO_ENABLED=0 go build, второй FROM с COPY --from.",
      "solution": "FROM golang:1.23 AS build\nWORKDIR /src\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .\nRUN CGO_ENABLED=0 go build -o /out/app ./cmd/app\n\nFROM gcr.io/distroless/static-debian12\nCOPY --from=build /out/app /app\nEXPOSE 8080\nENTRYPOINT [\"/app\"]",
      "starter": "",
      "code": false,
      "lang": "docker"
    },
    {
      "title": "Порядок слоёв",
      "task": "Почему go.mod и go.sum копируют до COPY . .? Что изменится, если сначала скопировать весь проект?",
      "hint": "Docker кэширует слои по содержимому.",
      "solution": "Сначала копируют только манифесты и запускают go mod download. Пока зависимости не менялись, этот слой берётся из кэша. Если копировать весь проект сразу, любое изменение кода сбрасывает кэш зависимостей, и сборка становится медленнее.",
      "starter": "",
      "code": false,
      "lang": "docker"
    }
  ],
  "backend:6": [
    {
      "title": "chi или net/http",
      "task": "Когда достаточно стандартного net/http, а когда стоит взять chi, Gin или Echo? Назовите по два критерия.",
      "hint": "Смотрите на число маршрутов, middleware, размер команды и допустимость зависимостей.",
      "solution": "net/http достаточно для небольших сервисов, простых маршрутов и когда важна минимизация зависимостей. chi удобен для групп маршрутов и middleware, оставаясь совместимым с http.Handler. Gin/Echo дают батарейки и свой контекст, но добавляют магию и привязку к фреймворку; их берут ради скорости разработки и знакомства команды.",
      "starter": "",
      "code": false,
      "lang": "go"
    },
    {
      "title": "Middleware",
      "task": "Напишите middleware, который добавляет заголовок X-App: roadmap к ответу и логирует метод и путь. Проверьте через httptest.",
      "hint": "func(next http.Handler) http.Handler и вызов next.ServeHTTP.",
      "solution": "package main\n\nimport (\n    \"fmt\"\n    \"net/http\"\n    \"net/http/httptest\"\n)\n\nfunc withHeaders(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        w.Header().Set(\"X-App\", \"roadmap\")\n        fmt.Println(r.Method, r.URL.Path)\n        next.ServeHTTP(w, r)\n    })\n}\n\nfunc main() {\n    h := withHeaders(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        fmt.Fprint(w, \"ok\")\n    }))\n    rec := httptest.NewRecorder()\n    h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, \"/tasks\", nil))\n    fmt.Println(rec.Header().Get(\"X-App\"), rec.Body.String())\n}",
      "starter": "package main\n\nimport (\n    \"fmt\"\n    \"net/http\"\n    \"net/http/httptest\"\n)\n\nfunc withHeaders(next http.Handler) http.Handler {\n    // TODO\n    return next\n}\n\nfunc main() {\n    h := withHeaders(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        fmt.Fprint(w, \"ok\")\n    }))\n    rec := httptest.NewRecorder()\n    h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, \"/tasks\", nil))\n    fmt.Println(rec.Header().Get(\"X-App\"), rec.Body.String())\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "projects:0": [
    {
      "title": "Разбор флагов",
      "task": "Напишите CLI с флагами -in (файл, по умолчанию \"-\") и -upper (bool). Разберите аргументы через flag.NewFlagSet и напечатайте значения.",
      "hint": "flag.NewFlagSet удобно тестировать: не трогает глобальные флаги.",
      "solution": "package main\n\nimport (\n    \"flag\"\n    \"fmt\"\n)\n\nfunc main() {\n    fs := flag.NewFlagSet(\"app\", flag.ContinueOnError)\n    in := fs.String(\"in\", \"-\", \"input file or - for stdin\")\n    upper := fs.Bool(\"upper\", false, \"uppercase output\")\n    if err := fs.Parse([]string{\"-in\", \"data.txt\", \"-upper\"}); err != nil {\n        fmt.Println(err)\n        return\n    }\n    fmt.Println(*in, *upper, fs.Args())\n}",
      "starter": "package main\n\nimport (\n    \"flag\"\n    \"fmt\"\n)\n\nfunc main() {\n    fs := flag.NewFlagSet(\"app\", flag.ContinueOnError)\n    // TODO: флаги -in и -upper, Parse, вывод\n    _ = fs\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "stdout, stderr и код выхода",
      "task": "Почему данные CLI пишут в stdout, ошибки в stderr, а при сбое возвращают ненулевой код? Приведите пример пайпа.",
      "hint": "Это позволяет отделить данные от диагностики и автоматизировать запуск.",
      "solution": "stdout — для результата, stderr — для сообщений об ошибке. Тогда `app | jq` получает только данные, а ошибки видны в терминале. Ненулевой код позволяет скриптам и CI понять, что команда упала: `app || exit 1`.",
      "starter": "",
      "code": false,
      "lang": "bash"
    }
  ],
  "projects:1": [
    {
      "title": "Слои приложения",
      "task": "Опишите структуру REST-сервиса: где HTTP-разбор, где бизнес-логика, где SQL. Почему store лучше спрятать за интерфейсом?",
      "hint": "cmd, internal/http, internal/service, internal/store. Интерфейс позволяет подменить БД в тестах.",
      "solution": "HTTP-слой разбирает запрос и формирует ответ, service содержит правила и не знает про http.Request, store отвечает за SQL. Интерфейс store в service позволяет подставить фейк в тестах и не тащить базу в unit-тесты.",
      "starter": "",
      "code": false,
      "lang": "go"
    },
    {
      "title": "Пагинация",
      "task": "Напишите Page(items []int, limit, offset int) []int с безопасными границами: отрицательные значения считаются нулём, offset больше длины даёт пустой слайс.",
      "hint": "Нормализуйте limit и offset, затем срежьте слайс.",
      "solution": "package main\n\nimport \"fmt\"\n\nfunc Page(items []int, limit, offset int) []int {\n    if limit < 0 {\n        limit = 0\n    }\n    if offset < 0 {\n        offset = 0\n    }\n    if offset >= len(items) || limit == 0 {\n        return []int{}\n    }\n    end := offset + limit\n    if end > len(items) {\n        end = len(items)\n    }\n    return items[offset:end]\n}\n\nfunc main() {\n    items := []int{1, 2, 3, 4, 5}\n    fmt.Println(Page(items, 2, 1)) // [2 3]\n    fmt.Println(Page(items, 10, 9)) // []\n}",
      "starter": "package main\n\nimport \"fmt\"\n\nfunc Page(items []int, limit, offset int) []int {\n    // TODO\n    return nil\n}\n\nfunc main() {\n    items := []int{1, 2, 3, 4, 5}\n    fmt.Println(Page(items, 2, 1))\n    fmt.Println(Page(items, 10, 9))\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "projects:2": [
    {
      "title": "Семафор на канале",
      "task": "Ограничьте параллельность восемью задачами: запустите горутины для urls, но не больше восьми одновременно. Используйте буферизованный канал.",
      "hint": "Запись в канал занимает слот, чтение освобождает.",
      "solution": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc fetch(url string) { fmt.Println(\"fetch\", url) }\n\nfunc main() {\n    urls := []string{\"a\", \"b\", \"c\", \"d\", \"e\", \"f\", \"g\", \"h\", \"i\", \"j\"}\n    sem := make(chan struct{}, 8)\n    var wg sync.WaitGroup\n\n    for _, url := range urls {\n        wg.Add(1)\n        go func(u string) {\n            defer wg.Done()\n            sem <- struct{}{}\n            defer func() { <-sem }()\n            fetch(u)\n        }(url)\n    }\n    wg.Wait()\n}",
      "starter": "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc fetch(url string) { fmt.Println(\"fetch\", url) }\n\nfunc main() {\n    urls := []string{\"a\", \"b\", \"c\", \"d\", \"e\", \"f\", \"g\", \"h\", \"i\", \"j\"}\n    sem := make(chan struct{}, 8)\n    var wg sync.WaitGroup\n    // TODO: запустите горутины с ограничением\n    wg.Wait()\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Отмена по Ctrl+C",
      "task": "Что должно произойти с конкурентным инструментом при Ctrl+C? Опишите порядок действий.",
      "hint": "Сигнал → отмена контекста → новые задачи не берутся → текущие прерываются → ожидание → выход.",
      "solution": "signal.NotifyContext отменяет контекст. Воркеры видят ctx.Done(), прекращают брать новые задачи и завершают текущие. main ждёт WaitGroup, закрывает ресурсы и выходит с понятным кодом. Без отмены процесс либо висит, либо обрывает работу на середине.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "projects:3": [
    {
      "title": "README проекта",
      "task": "Составьте скелет README для REST API: что должно быть в первых пяти блоках, чтобы проект можно было запустить с нуля?",
      "hint": "Название и назначение, быстрый старт, переменные окружения, API, тесты.",
      "solution": "1. Название и одно предложение о задаче.\n2. Стек и статус.\n3. Быстрый старт: prerequisites, cp .env.example, docker compose up.\n4. Переменные окружения и примеры запросов.\n5. Тесты и известные ограничения.\nПроверьте команды на чистом клоне.",
      "starter": "",
      "code": false,
      "lang": "text"
    },
    {
      "title": "Проверка команд",
      "task": "Почему перед публикацией README нужно выполнить его команды на чистом клоне? Что чаще всего ломается?",
      "hint": "Локальные артефакты, забытые переменные, другой порядок шагов.",
      "solution": "В README часто не хватает шага с миграциями, переменных окружения или установки зависимостей. На машине автора всё работает из-за старых файлов и настроек. Чистый клон и новая папка выявляют это до ревьюера.",
      "starter": "",
      "code": false,
      "lang": "bash"
    }
  ],
  "interview:0": [
    {
      "title": "Предскажите append",
      "task": "Что напечатает код? Объясните, почему второй слайс не увидел новое значение.\n\na := make([]int, 2, 2)\nb := append(a, 3)\nb[0] = 99\nfmt.Println(a, b)",
      "hint": "append при нехватке ёмкости выделяет новый массив.",
      "solution": "a: [0 0], b: [99 0 3]\n\nЁмкость a равна 2, поэтому append выделил новый массив и скопировал элементы. b больше не разделяет данные с a, изменение b[0] не влияет на a.",
      "starter": "",
      "code": false,
      "lang": "go"
    },
    {
      "title": "Изменить структуру",
      "task": "Напишите функцию Birthday(u *User), которая увеличивает Age на 1, и пример, показывающий разницу с получателем-значением.",
      "hint": "Указатель меняет оригинал, значение — копию.",
      "solution": "package main\n\nimport \"fmt\"\n\ntype User struct {\n    Name string\n    Age  int\n}\n\nfunc Birthday(u *User) {\n    u.Age++\n}\n\nfunc main() {\n    u := User{Name: \"Ann\", Age: 20}\n    Birthday(&u)\n    fmt.Println(u.Age) // 21\n}",
      "starter": "package main\n\nimport \"fmt\"\n\ntype User struct {\n    Name string\n    Age  int\n}\n\nfunc Birthday(u *User) {\n    // TODO\n}\n\nfunc main() {\n    u := User{Name: \"Ann\", Age: 20}\n    Birthday(&u)\n    fmt.Println(u.Age)\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "interview:1": [
    {
      "title": "Найдите утечку",
      "task": "Почему горутина не завершится?\n\nfunc f() {\n    ch := make(chan int)\n    go func() {\n        for v := range ch {\n            fmt.Println(v)\n        }\n    }()\n}",
      "hint": "range ждёт закрытия, но канал никто не закрывает.",
      "solution": "Функция возвращается, канал остаётся открытым, range блокируется навсегда. Нужно закрыть канал или добавить ctx.Done() и select. Если отправителей несколько, закрывает координатор после WaitGroup.",
      "starter": "",
      "code": false,
      "lang": "go"
    },
    {
      "title": "Отмена воркера",
      "task": "Напишите Run(ctx context.Context, in <-chan int) []int, который читает in до отмены контекста и возвращает накопленные значения.",
      "hint": "select между in и ctx.Done(), выход по отмене.",
      "solution": "package main\n\nimport (\n    \"context\"\n    \"fmt\"\n    \"time\"\n)\n\nfunc Run(ctx context.Context, in <-chan int) []int {\n    var out []int\n    for {\n        select {\n        case <-ctx.Done():\n            return out\n        case v, ok := <-in:\n            if !ok {\n                return out\n            }\n            out = append(out, v)\n        }\n    }\n}\n\nfunc main() {\n    ctx, cancel := context.WithTimeout(context.Background(), 20*time.Millisecond)\n    defer cancel()\n    in := make(chan int, 3)\n    in <- 1\n    in <- 2\n    fmt.Println(Run(ctx, in))\n}",
      "starter": "package main\n\nimport (\n    \"context\"\n    \"fmt\"\n    \"time\"\n)\n\nfunc Run(ctx context.Context, in <-chan int) []int {\n    // TODO: select с ctx.Done()\n    return nil\n}\n\nfunc main() {\n    ctx, cancel := context.WithTimeout(context.Background(), 20*time.Millisecond)\n    defer cancel()\n    in := make(chan int, 3)\n    in <- 1\n    in <- 2\n    fmt.Println(Run(ctx, in))\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "interview:2": [
    {
      "title": "Архитектура проекта по STAR",
      "task": "Расскажите о pet-проекте по схеме Situation → Task → Action → Result. Запишите 5–6 предложений с конкретными решениями.",
      "hint": "Не пересказывайте файлы. Назовите задачу, архитектуру, ваши решения и результат.",
      "solution": "Пример: «Нужен был сервис заметок для практики Go. Я сделал REST API на net/http и PostgreSQL: разделил handler/service/store, добавил миграции и Docker Compose. Для тестов подменял store интерфейсом, HTTP проверял через httptest. В результате сервис поднимается одной командой, покрыты основные сценарии, а узкое место — отсутствие кэша — записано в ограничения».",
      "starter": "",
      "code": false,
      "lang": "text"
    },
    {
      "title": "Trade-off",
      "task": "Почему вы выбрали PostgreSQL, а не SQLite? Сформулируйте ответ через альтернативы, критерии и цену решения.",
      "hint": "База, конкурентность, деплой, знакомство команды, сложность.",
      "solution": "Критерии: конкурентная запись, транзакции, знакомый команде инструмент, возможность масштабировать отдельно. PostgreSQL выигрывает по конкурентности и экосистеме, цена — отдельный сервис, миграции и администрирование. SQLite проще в деплое, но хуже подходит для нескольких писателей и сетевого доступа.",
      "starter": "",
      "code": false,
      "lang": "text"
    }
  ],
  "interview:3": [
    {
      "title": "Two Sum",
      "task": "Дан nums []int и target int. Верните индексы двух чисел, дающих target. Решение за O(n) через map.",
      "hint": "Храните в map значение → индекс, проверяйте target-n.",
      "solution": "package main\n\nimport \"fmt\"\n\nfunc TwoSum(nums []int, target int) []int {\n    seen := make(map[int]int, len(nums))\n    for i, n := range nums {\n        if j, ok := seen[target-n]; ok {\n            return []int{j, i}\n        }\n        seen[n] = i\n    }\n    return nil\n}\n\nfunc main() {\n    fmt.Println(TwoSum([]int{2, 7, 11, 15}, 9)) // [0 1]\n}",
      "starter": "package main\n\nimport \"fmt\"\n\nfunc TwoSum(nums []int, target int) []int {\n    // TODO: map за O(n)\n    return nil\n}\n\nfunc main() {\n    fmt.Println(TwoSum([]int{2, 7, 11, 15}, 9))\n}",
      "code": true,
      "lang": "go"
    },
    {
      "title": "Valid Parentheses",
      "task": "Проверьте, правильно ли расставлены скобки (), [] и {}. Пустая строка считается валидной.",
      "hint": "Стек открывающих, проверка пары при закрывающей.",
      "solution": "package main\n\nimport \"fmt\"\n\nfunc Valid(s string) bool {\n    pairs := map[rune]rune{')': '(', ']': '[', '}': '{'}\n    stack := make([]rune, 0, len(s))\n    for _, ch := range s {\n        switch ch {\n        case '(', '[', '{':\n            stack = append(stack, ch)\n        case ')', ']', '}':\n            if len(stack) == 0 || stack[len(stack)-1] != pairs[ch] {\n                return false\n            }\n            stack = stack[:len(stack)-1]\n        }\n    }\n    return len(stack) == 0\n}\n\nfunc main() {\n    fmt.Println(Valid(\"()[]{}\")) // true\n    fmt.Println(Valid(\"(]\"))     // false\n}",
      "starter": "package main\n\nimport \"fmt\"\n\nfunc Valid(s string) bool {\n    // TODO: стек\n    return false\n}\n\nfunc main() {\n    fmt.Println(Valid(\"()[]{}\"))\n    fmt.Println(Valid(\"(]\"))\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "interview:4": [
    {
      "title": "Быстрые ответы",
      "task": "Дайте короткие ответы: идемпотентность, 401 vs 403, N+1, merge vs rebase.",
      "hint": "По одному предложению на термин, с примером.",
      "solution": "Идемпотентность — повторный запрос даёт тот же результат (GET, PUT, DELETE).\n401 — не аутентифицирован, 403 — прав нет.\nN+1 — N дополнительных запросов вместо JOIN или пакетной загрузки.\nmerge сохраняет историю и создаёт коммит слияния, rebase переносит коммиты и переписывает хеши.",
      "starter": "",
      "code": false,
      "lang": "text"
    },
    {
      "title": "N+1 на практике",
      "task": "Есть список из 50 заказов, для каждого нужен пользователь. Как выглядит проблема N+1 и как её исправить одним запросом?",
      "hint": "JOIN или WHERE id IN (...) + map.",
      "solution": "Плохо: один запрос за заказами и 50 запросов SELECT * FROM users WHERE id = ?. Хорошо: JOIN users в запросе заказов или второй запрос WHERE id = ANY($1) и сборка map[int]User. Тогда будет 1–2 запроса вместо 51.",
      "starter": "",
      "code": false,
      "lang": "sql"
    }
  ],
  "interview:5": [
    {
      "title": "Самопрезентация",
      "task": "Напишите текст самопрезентации на 1–2 минуты: кто вы, стек, один проект, почему эта роль. Не пересказывайте резюме.",
      "hint": "Формула: настоящее → проекты → мотивация. 4–6 предложений.",
      "solution": "Пример: «Я начинающий Go-разработчик, совмещаю учёбу с практикой: сделал CLI-утилиту и REST API на Go с PostgreSQL. В API разделил слои, добавил миграции, тесты и Docker Compose. Больше всего мне нравится доводить сервис до рабочего состояния и разбираться в конкурентности. Ищу стажировку, где смогу расти в backend-разработке и учиться у опытной команды».",
      "starter": "",
      "code": false,
      "lang": "text"
    },
    {
      "title": "Объясните слайс",
      "task": "Объясните слайс вслух за 60 секунд: из чего состоит, чем отличается от массива, что делает append. Запишите тезисы.",
      "hint": "Указатель, длина, ёмкость; копирование заголовка; перевыделение.",
      "solution": "Слайс — дескриптор из указателя на массив, длины и ёмкости. Массив — значение фиксированной длины и копируется целиком. При передаче слайса копируется заголовок, данные общие. append пишет в тот же массив при достаточной ёмкости, иначе выделяет новый и копирует элементы.",
      "starter": "",
      "code": false,
      "lang": "text"
    }
  ],
  "internship:0": [
    {
      "title": "Пункты резюме",
      "task": "Напишите 3 пункта для проекта в резюме по схеме «действие → технология → результат». Без обязанностей и общих слов.",
      "hint": "Начинайте с глагола: сделал, реализовал, покрыл, запустил.",
      "solution": "Реализовал REST API на Go с PostgreSQL: 6 эндпоинтов, миграции и валидация входных данных.\nПокрыл бизнес-логику табличными тестами и HTTP-слой через httptest.\nЗапустил сервис и БД в Docker Compose, описал запуск в README.",
      "starter": "",
      "code": false,
      "lang": "text"
    },
    {
      "title": "Ошибки в резюме",
      "task": "Что лишнее в резюме: шкалы владения языком, фото, «умею всё», список из 15 технологий, ссылка на GitHub, 3 страницы?",
      "hint": "Рекрутер сканирует 10–30 секунд.",
      "solution": "Лишнее: шкалы и проценты, фото, «умею всё», технологии без подтверждения, объём больше одной страницы. Ссылка на GitHub нужна. Оставьте стек, 1–2 проекта с результатом и образование.",
      "starter": "",
      "code": false,
      "lang": "text"
    }
  ],
  "internship:1": [
    {
      "title": "Закреплённые репозитории",
      "task": "Сколько проектов закрепить на GitHub и что должно быть в каждом?",
      "hint": "3–6 проектов, README, запуск, тесты, история коммитов.",
      "solution": "3–6 лучших проектов. В каждом: README с задачей, стеком, командами запуска и тестов, примером использования и ограничениями. История коммитов должна показывать процесс, а не один initial commit.",
      "starter": "",
      "code": false,
      "lang": "text"
    },
    {
      "title": "Профильный README",
      "task": "Зачем нужен профильный README и что в нём писать?",
      "hint": "Коротко: кто вы, стек, чем занимаетесь, ссылки на проекты и контакты.",
      "solution": "Профильный README — визитка на странице GitHub. В нём: 2–3 предложения о вас, стек, текущий фокус, ссылки на 2–3 проекта и контакты. Он не обязателен, но помогает рекрутеру быстро понять контекст.",
      "starter": "",
      "code": false,
      "lang": "text"
    }
  ],
  "internship:2": [
    {
      "title": "План откликов",
      "task": "Составьте план на неделю: сколько откликов, где искать, как адаптировать резюме и когда делать follow-up.",
      "hint": "5–10 качественных откликов, таблица, follow-up через 5–7 дней.",
      "solution": "5–10 откликов в неделю: LinkedIn, hh, Telegram-каналы, карьерные страницы. Под каждую вакансию подсветить релевантные проекты и стек. Вести таблицу: компания, вакансия, дата, статус, контакт. Follow-up через 5–7 рабочих дней, если нет ответа.",
      "starter": "",
      "code": false,
      "lang": "text"
    },
    {
      "title": "Follow-up",
      "task": "Через сколько дней писать после отклика и что написать? Чего делать не стоит?",
      "hint": "5–7 рабочих дней, коротко и по делу.",
      "solution": "Через 5–7 рабочих дней: короткое сообщение с названием вакансии, датой отклика и напоминанием о себе. Не стоит писать каждый день, дублировать отклик и требовать ответа. После отказа можно вежливо попросить обратную связь.",
      "starter": "",
      "code": false,
      "lang": "text"
    }
  ],
  "internship:3": [
    {
      "title": "Рассказ о себе",
      "task": "Запишите самопрезентацию на 1–2 минуты и отметьте: есть ли конкретика, нет ли слов-паразитов, уложились ли в таймер.",
      "hint": "Проверьте по таймеру и прослушайте запись.",
      "solution": "Проверочный список: кто вы → стек → один проект с результатом → почему роль. Конкретика вместо «умею много». Без длинного вступления. Уложиться в 2 минуты. Записать себя и убрать лишнее.",
      "starter": "",
      "code": false,
      "lang": "text"
    },
    {
      "title": "История проекта",
      "task": "Подготовьте рассказ о проекте на 2–3 минуты: проблема, архитектура, ваша роль, trade-offs, результат.",
      "hint": "Схема: проблема → требования → архитектура → решения → результат → что улучшить.",
      "solution": "Проблема: нужен был сервис для задач. Требования: CRUD, PostgreSQL, тесты, запуск одной командой. Архитектура: handler → service → store, миграции, Docker Compose. Решения: интерфейс store для тестов, httptest для HTTP. Результат: 6 эндпоинтов, тесты, README. Улучшил бы: добавил аутентификацию и кэш.",
      "starter": "",
      "code": false,
      "lang": "text"
    }
  ],
  "advanced-go:0": [
    {
      "title": "GOMAXPROCS на практике",
      "task": "Запустите один и тот же CPU-бенчмарк с GOMAXPROCS=1 и GOMAXPROCS=4. Объясните разницу во времени и почему она не всегда четырёхкратная.",
      "hint": "Используйте go test -bench=. -cpu=1,4. Посмотрите, есть ли общие мьютексы или аллокации.",
      "solution": "GOMAXPROCS=1 выполняет горутины конкурентно, но не параллельно: в один момент работает один P. При 4 процессорных ядрах CPU-bound код может ускориться почти в 4 раза, но рост ограничен законом Амдала, contention на мьютексах, аллокациями и миграцией горутин. Если бенчмарк упирается в общий счётчик под mutex, добавление P не поможет.",
      "starter": "go test -run=^$ -bench=BenchmarkSum -cpu=1,2,4 -benchmem",
      "code": false,
      "lang": "bash"
    }
  ],
  "advanced-go:1": [
    {
      "title": "Найти escape и убрать его",
      "task": "Функция возвращает *int, из-за чего значение уходит в кучу. Перепишите API так, чтобы маленькое значение оставалось на стеке, и проверьте через -gcflags=-m.",
      "hint": "Возвращайте значение, а не указатель, если вызывающему не нужна идентичность.",
      "solution": "Было:\nfunc inc(x int) *int { x++; return &x }\n\nСтало:\nfunc inc(x int) int { return x + 1 }\n\nПроверка: go build -gcflags='-m' ./... покажет moved to heap для старой версии. Указатель нужен только если объект большой, разделяемый или должен менять состояние.",
      "starter": "package main\n\nfunc inc(x int) *int {\n    x++\n    return &x\n}\n\nfunc main() { _ = inc(1) }",
      "code": true,
      "lang": "go"
    }
  ],
  "advanced-go:2": [
    {
      "title": "Снять CPU-профиль",
      "task": "Добавьте pprof в HTTP-сервис и снимите 30-секундный CPU-профиль. Какие три функции оказались самыми дорогими?",
      "hint": "Импортируйте net/http/pprof и откройте /debug/pprof/profile?seconds=30.",
      "solution": "import _ \"net/http/pprof\"\n\n// затем:\n// go tool pprof -http=:8080 'http://localhost:6060/debug/pprof/profile?seconds=30'\n\nВ top смотрите flat и cum. Flat — время в самой функции, cum — включая потомков. Оптимизируйте функцию с высоким flat на горячем пути, а не случайную из списка.",
      "starter": "package main\n\nimport (\n    \"net/http\"\n)\n\nfunc main() {\n    http.ListenAndServe(\":6060\", nil)\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "advanced-go:3": [
    {
      "title": "Кэш метаданных reflect",
      "task": "Ускорьте чтение поля структуры через reflect: найдите индекс поля один раз и переиспользуйте его вместо FieldByName на каждом вызове.",
      "hint": "reflect.TypeOf(...).FieldByName возвращает StructField с Index []int.",
      "solution": "var emailIndex = func() []int {\n    f, ok := reflect.TypeOf(User{}).FieldByName(\"Email\")\n    if !ok { panic(\"no Email\") }\n    return f.Index\n}()\n\nfunc Email(v any) string {\n    return reflect.ValueOf(v).FieldByIndex(emailIndex).String()\n}\n\nКэш убирает линейный поиск по имени. Для горячего пути лучше кодогенерация или явный интерфейс.",
      "starter": "package main\n\nimport \"reflect\"\n\ntype User struct{ Name, Email string }\n\nfunc Email(v any) string {\n    return reflect.ValueOf(v).FieldByName(\"Email\").String()\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "advanced-go:4": [
    {
      "title": "Fuzz-тест парсера",
      "task": "Напишите FuzzParse для функции Parse(s string) (int, error), которая принимает только цифры. Инвариант: либо ошибка, либо неотрицательное число.",
      "hint": "Добавьте seed-корпуса f.Add и проверяйте инвариант в f.Fuzz.",
      "solution": "func FuzzParse(f *testing.F) {\n    f.Add(\"0\")\n    f.Add(\"123\")\n    f.Add(\"-1\")\n    f.Fuzz(func(t *testing.T, s string) {\n        n, err := Parse(s)\n        if err != nil { return }\n        if n < 0 { t.Fatalf(\"negative %d for %q\", n, s) }\n    })\n}\n\nЗапуск: go test -fuzz=FuzzParse -fuzztime=30s. Падение сохраняется в testdata/fuzz и воспроизводится обычным go test.",
      "starter": "package main\n\nimport \"testing\"\n\nfunc Parse(s string) (int, error) {\n    // TODO\n    return 0, nil\n}\n\nfunc FuzzParse(f *testing.F) {\n    // TODO\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "architecture:0": [
    {
      "title": "Вынести хранилище за интерфейс",
      "task": "Обработчик напрямую вызывает *sql.DB. Вынесите нужный метод в интерфейс рядом с сервисом и сделайте фейк для теста.",
      "hint": "Интерфейс должен содержать только методы, которые реально нужны сервису.",
      "solution": "type TaskStore interface {\n    Create(ctx context.Context, title string) (Task, error)\n}\n\ntype Service struct{ store TaskStore }\n\ntype fakeStore struct{ got string }\nfunc (f *fakeStore) Create(_ context.Context, title string) (Task, error) {\n    f.got = title\n    return Task{ID: 1, Title: title}, nil\n}\n\nТеперь тест сервиса не требует Postgres, а SQL-реализация проверяется отдельно.",
      "starter": "type Service struct{ db *sql.DB }\n\nfunc (s *Service) Create(ctx context.Context, title string) (Task, error) {\n    // TODO: вынести SQL за интерфейс\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "architecture:1": [
    {
      "title": "Границы модулей",
      "task": "В монолите есть пакеты orders, billing и inventory, которые читают таблицы друг друга. Предложите три шага, чтобы сделать границы явными, не переписывая всё.",
      "hint": "Начните с владения данными и интерфейсов, а не с разделения на сервисы.",
      "solution": "1. Определите владельца каждой таблицы: orders владеет orders, billing — invoices, inventory — stock.\n2. Запретите прямые SQL-запросы к чужим таблицам: замените их вызовами интерфейсов в коде.\n3. Для асинхронных побочных эффектов добавьте события/outbox.\n\nВынос в отдельный сервис — последний шаг, когда границы стабильны и есть отдельная нагрузка или команда.",
      "starter": "",
      "code": false,
      "lang": "text"
    }
  ],
  "architecture:2": [
    {
      "title": "Спроектировать контракт API",
      "task": "Для создания заказа спроектируйте метод, тело, успешный ответ и ошибки. Учтите идемпотентность и валидацию.",
      "hint": "POST /orders, Idempotency-Key, 201 + Location, 409 при конфликте, 422 при бизнес-валидации.",
      "solution": "POST /v1/orders\nIdempotency-Key: <uuid>\n{ \"items\": [{\"sku\":\"A1\",\"qty\":2}], \"address_id\": 10 }\n\n201 Created\nLocation: /v1/orders/123\n{ \"id\":123,\"status\":\"pending\",\"total\":1990 }\n\n400 — битый JSON, 422 — пустой items или недоступный адрес, 409 — повтор с другим телом при том же ключе, 429 — лимит.",
      "starter": "",
      "code": false,
      "lang": "http"
    }
  ],
  "architecture:3": [
    {
      "title": "Outbox вместо двойной записи",
      "task": "Сервис сохраняет заказ и публикует событие в Kafka. Опишите, как не потерять событие при падении между коммитом и отправкой.",
      "hint": "Запись в outbox должна быть в той же транзакции, что и заказ.",
      "solution": "BEGIN;\nINSERT INTO orders (...) VALUES (...);\nINSERT INTO outbox (topic, payload, created_at) VALUES ('orders', $1, now());\nCOMMIT;\n\nОтдельный публикатор читает неотправленные строки, публикует и помечает sent_at. Публикация at-least-once, потребитель дедуплицирует по event_id. Так событие не теряется и не уходит при откате.",
      "starter": "",
      "code": false,
      "lang": "sql"
    }
  ],
  "architecture:4": [
    {
      "title": "Singleflight для горячего ключа",
      "task": "Тысяча запросов одновременно промахивается по одному ключу кэша. Добавьте singleflight, чтобы в БД ушёл один запрос.",
      "hint": "golang.org/x/sync/singleflight, ключ — ID пользователя.",
      "solution": "v, err, _ := group.Do(strconv.Itoa(id), func() (any, error) {\n    u, err := repo.Get(ctx, id)\n    if err != nil { return nil, err }\n    cache.Set(id, u, time.Minute)\n    return u, nil\n})\nif err != nil { return User{}, err }\nreturn v.(User), nil\n\nОстальные запросы дождутся результата первого. Важно: ошибка тоже распространяется на всех, поэтому не кэшируйте её надолго.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "data-scale:0": [
    {
      "title": "Прочитать план запроса",
      "task": "Запрос фильтрует tasks по user_id и status, сортирует по created_at. Предложите индекс и проверьте план через EXPLAIN ANALYZE.",
      "hint": "Составной индекс: сначала равенства, потом сортировка.",
      "solution": "CREATE INDEX CONCURRENTLY idx_tasks_user_status_created\nON tasks (user_id, status, created_at DESC);\n\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT id, title FROM tasks\nWHERE user_id = $1 AND status = 'open'\nORDER BY created_at DESC LIMIT 20;\n\nОжидаем Index Scan без Sort. Смотрите actual rows и buffers, а не только cost.",
      "starter": "",
      "code": false,
      "lang": "sql"
    }
  ],
  "data-scale:1": [
    {
      "title": "Защита от lost update",
      "task": "Два запроса одновременно списывают деньги с одного счёта. Напишите UPDATE, который не позволит уйти в минус без отдельного SELECT.",
      "hint": "Проверьте баланс в условии UPDATE и смотрите RowsAffected.",
      "solution": "res, err := tx.ExecContext(ctx,\n    \"UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $1\",\n    amount, id)\nif err != nil { return err }\nif n, _ := res.RowsAffected(); n != 1 {\n    return ErrInsufficientFunds\n}\n\nУсловие проверяется атомарно под блокировкой строки. При serialization failure повторите транзакцию.",
      "starter": "",
      "code": false,
      "lang": "sql"
    }
  ],
  "data-scale:2": [
    {
      "title": "Безопасное переименование колонки",
      "task": "Нужно переименовать users.email в users.email_normalized без простоя. Распишите релизы по шагам.",
      "hint": "Expand/contract: добавить, писать в оба, backfill, переключить чтение, удалить старое.",
      "solution": "1. ALTER TABLE users ADD COLUMN email_normalized text;\n2. Код пишет в оба поля, читает из старого.\n3. Backfill батчами: UPDATE ... WHERE id IN (SELECT id ... LIMIT 1000).\n4. Переключить чтение на новое поле, проверить метрики.\n5. Перестать писать в старое.\n6. ALTER TABLE users DROP COLUMN email.\n\nКаждый шаг совместим с предыдущей версией приложения.",
      "starter": "",
      "code": false,
      "lang": "sql"
    }
  ],
  "data-scale:3": [
    {
      "title": "Блокировка с владельцем",
      "task": "Реализуйте захват Redis-блокировки с TTL и безопасное освобождение, чтобы чужой процесс не снял ваш лок.",
      "hint": "SET NX PX и Lua-сравнение значения.",
      "solution": "token := uuid.NewString()\nok, err := rdb.SetNX(ctx, \"lock:job:\"+id, token, 30*time.Second).Result()\nif err != nil || !ok { return ErrLocked }\n\ndefer rdb.Eval(ctx, `\nif redis.call(\"get\", KEYS[1]) == ARGV[1] then\n  return redis.call(\"del\", KEYS[1])\nend`, []string{\"lock:job:\" + id}, token)\n\nTTL спасает от вечной блокировки, сравнение токена — от удаления чужого лока.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "data-scale:4": [
    {
      "title": "Keyset-пагинация",
      "task": "Замените OFFSET 100000 на keyset-пагинацию по (created_at, id). Напишите SQL и объясните, почему он быстрее.",
      "hint": "WHERE (created_at, id) < ($1, $2) ORDER BY created_at DESC, id DESC LIMIT $3.",
      "solution": "SELECT id, title, created_at\nFROM tasks\nWHERE (created_at, id) < ($1, $2)\nORDER BY created_at DESC, id DESC\nLIMIT $3;\n\nOFFSET читает и выбрасывает все предыдущие строки. Keyset идёт по индексу от последней пары и читает только страницу. Курсор — последняя пара (created_at, id).",
      "starter": "",
      "code": false,
      "lang": "sql"
    }
  ],
  "observability:0": [
    {
      "title": "Структурный лог запроса",
      "task": "Замените текстовый лог на slog с request_id, методом, путём, статусом и длительностью.",
      "hint": "Оберните ResponseWriter, чтобы знать статус, и замерьте time.Since.",
      "solution": "start := time.Now()\nrec := &statusRecorder{ResponseWriter: w, status: 200}\nnext.ServeHTTP(rec, r)\nslog.Info(\"request\",\n    \"request_id\", requestID(r.Context()),\n    \"method\", r.Method,\n    \"path\", r.URL.Path,\n    \"status\", rec.status,\n    \"duration_ms\", time.Since(start).Milliseconds(),\n)\n\nНе логируйте Authorization и тело запроса.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "observability:1": [
    {
      "title": "Гистограмма latency",
      "task": "Добавьте гистограмму длительности HTTP-запросов с метками route, method, status и посчитайте p95 в PromQL.",
      "hint": "Buckets вокруг SLO-порога, затем histogram_quantile по sum by (le).",
      "solution": "histogram_quantile(0.95,\n  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))\n)\n\nМетки route/method/status дают разбивку. Не добавляйте user_id: кардинальность взорвётся. Buckets: .05, .1, .25, .5, 1, 2, 5.",
      "starter": "",
      "code": false,
      "lang": "promql"
    }
  ],
  "observability:2": [
    {
      "title": "Span вокруг вызова",
      "task": "Оберните вызов репозитория в span, добавьте атрибуты и запишите ошибку.",
      "hint": "tracer.Start(ctx, ...), defer span.End(), RecordError и SetStatus.",
      "solution": "ctx, span := tracer.Start(ctx, \"users.Get\")\ndefer span.End()\nspan.SetAttributes(attribute.Int(\"user.id\", id))\n\nu, err := repo.Get(ctx, id)\nif err != nil {\n    span.RecordError(err)\n    span.SetStatus(codes.Error, err.Error())\n    return User{}, err\n}\nreturn u, nil\n\nПередавайте ctx дальше, иначе дочерние спаны потеряют родителя.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "observability:3": [
    {
      "title": "Runbook для 5xx",
      "task": "Напишите короткий runbook для алерта «доля 5xx выше 2% в течение 10 минут».",
      "hint": "Проверки: деплой, зависимости, насыщение, откат, эскалация.",
      "solution": "# Runbook: HighErrorRate\n1. Открыть дашборд: error rate по route, latency, saturation.\n2. Проверить последние деплои и фича-флаги.\n3. Проверить БД, Redis, внешние API и таймауты.\n4. Если ошибки начались после релиза — откатить.\n5. Если зависимость недоступна — включить деградацию/кэш.\n6. Эскалировать владельцу через 15 минут без улучшения.\n7. После — postmortem с действиями и сроками.",
      "starter": "",
      "code": false,
      "lang": "text"
    }
  ],
  "observability:4": [
    {
      "title": "Ступенчатый нагрузочный тест",
      "task": "Опишите сценарий k6: 30 секунд до 50 VU, минута на 50, затем до 200. Что будете смотреть кроме RPS?",
      "hint": "stages в options; смотрите p95/p99, ошибки, saturation.",
      "solution": "export const options = {\n  stages: [\n    { duration: '30s', target: 50 },\n    { duration: '1m', target: 50 },\n    { duration: '30s', target: 200 },\n  ],\n  thresholds: { http_req_failed: ['rate<0.01'], http_req_duration: ['p(95)<300'] },\n};\n\nКроме RPS: p95/p99, доля ошибок, таймауты, загрузка CPU/памяти, пул соединений, lag БД. Ищите колено, где latency начинает расти нелинейно.",
      "starter": "",
      "code": false,
      "lang": "js"
    }
  ],
  "security:0": [
    {
      "title": "Строгая проверка JWT",
      "task": "Напишите проверку JWT: фиксированный алгоритм, подпись, issuer, audience и срок действия.",
      "hint": "Не доверяйте alg из токена; проверяйте ключ и claims.",
      "solution": "claims := &Claims{}\ntok, err := jwt.ParseWithClaims(raw, claims, func(t *jwt.Token) (any, error) {\n    if t.Method.Alg() != jwt.SigningMethodRS256.Alg() {\n        return nil, errors.New(\"unexpected alg\")\n    }\n    return publicKey, nil\n})\nif err != nil || !tok.Valid() { return ErrUnauthorized }\nif claims.Issuer != issuer || !claims.Audience.Contains(audience) {\n    return ErrUnauthorized\n}\n\nСекрет не храните в коде; ключ — из secret manager.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "security:1": [
    {
      "title": "Убрать SQLi и XSS",
      "task": "Найдите две уязвимости: query := \"SELECT ... WHERE name = '\" + name + \"'\" и w.Write([]byte(\"<p>\" + comment + \"</p>\")). Исправьте обе.",
      "hint": "Параметры вместо склейки; html/template вместо ручной конкатенации.",
      "solution": "row := db.QueryRowContext(ctx,\n    \"SELECT id FROM users WHERE name = $1\", name)\n\ntmpl := template.Must(template.New(\"c\").Parse(`<p>{{.}}</p>`))\ntmpl.Execute(w, comment)\n\nПараметры отделяют данные от SQL. html/template экранирует по контексту. Для богатого HTML нужен санитайзер, а не отключение экранирования.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "security:2": [
    {
      "title": "Валидация конфига на старте",
      "task": "Соберите конфиг из env и упадите до запуска сервера, если DATABASE_URL пуст или READ_TIMEOUT не парсится.",
      "hint": "Отдельная структура, env-хелпер, errors с контекстом.",
      "solution": "type Config struct { DatabaseURL string; ReadTimeout time.Duration }\n\nfunc Load() (Config, error) {\n    cfg := Config{DatabaseURL: os.Getenv(\"DATABASE_URL\"), ReadTimeout: 5*time.Second}\n    if cfg.DatabaseURL == \"\" { return cfg, errors.New(\"DATABASE_URL is required\") }\n    if raw := os.Getenv(\"READ_TIMEOUT\"); raw != \"\" {\n        d, err := time.ParseDuration(raw)\n        if err != nil { return cfg, fmt.Errorf(\"READ_TIMEOUT: %w\", err) }\n        cfg.ReadTimeout = d\n    }\n    return cfg, nil\n}",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "security:3": [
    {
      "title": "Rate limit по ключу",
      "task": "Ограничьте 5 запросов в секунду на пользователя с burst 10. Что вернёте при превышении?",
      "hint": "rate.NewLimiter и map с мьютексом; 429 + Retry-After.",
      "solution": "lim := rate.NewLimiter(5, 10)\nif !lim.Allow() {\n    w.Header().Set(\"Retry-After\", \"1\")\n    http.Error(w, \"too many requests\", http.StatusTooManyRequests)\n    return\n}\n\nДля нескольких инстансов нужен общий Redis-счётчик. За прокси берите реальный IP только из доверенного заголовка.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "security:4": [
    {
      "title": "Проверка уязвимостей в CI",
      "task": "Добавьте шаг CI, который блокирует merge при достижимых critical/high уязвимостях, и генерацию SBOM.",
      "hint": "govulncheck ./... и syft; политика по severity.",
      "solution": "- name: vulncheck\n  run: |\n    go install golang.org/x/vuln/cmd/govulncheck@latest\n    govulncheck ./...\n\n- name: sbom\n  run: syft . -o spdx-json > sbom.json\n\ngovulncheck учитывает call graph и меньше шумит. SBOM храните с артефактом релиза, чтобы быстро найти затронутые версии.",
      "starter": "",
      "code": false,
      "lang": "yaml"
    }
  ],
  "system-design:0": [
    {
      "title": "Оценка нагрузки",
      "task": "10 млн DAU, 20 чтений и 1 запись на пользователя в день. Оцените средний и пиковый QPS.",
      "hint": "Делите на 86400 и умножьте пик на 2–5.",
      "solution": "reads = 10_000_000 * 20 / 86400 ≈ 2315 QPS\nwrites = 10_000_000 * 1 / 86400 ≈ 116 QPS\n\nПик при коэффициенте 3: ~7000 read QPS и ~350 write QPS. Дальше оцените объём: 10 млн записей × размер × репликация. Эти числа определяют, нужен ли кэш и шардирование.",
      "starter": "",
      "code": false,
      "lang": "text"
    }
  ],
  "system-design:1": [
    {
      "title": "Схема сокращателя",
      "task": "Спроектируйте таблицу ссылок и запрос редиректа с учётом срока жизни и уникальности кода.",
      "hint": "PK code, уникальный индекс, expires_at, выборка по коду.",
      "solution": "CREATE TABLE links (\n  code text PRIMARY KEY,\n  url text NOT NULL,\n  created_at timestamptz NOT NULL DEFAULT now(),\n  expires_at timestamptz\n);\n\nSELECT url FROM links\nWHERE code = $1 AND (expires_at IS NULL OR expires_at > now());\n\nPK гарантирует уникальность. Для статистики не пишите в эту таблицу на каждом клике — отправляйте событие в очередь.",
      "starter": "",
      "code": false,
      "lang": "sql"
    }
  ],
  "system-design:2": [
    {
      "title": "Гибридный fan-out",
      "task": "У пользователя 10 млн подписчиков. Почему fan-out on write плох и как сделать гибрид?",
      "hint": "Обычные пользователи — precompute, знаменитости — on read.",
      "solution": "Fan-out on write создаст 10 млн записей на один пост: дорого по CPU, памяти и времени. Гибрид:\n1. Для обычных авторов заранее пишем post_id в ленты подписчиков.\n2. Для знаменитостей храним посты отдельно и подмешиваем при чтении.\n3. При сборке объединяем источники, дедуплицируем, сортируем и отдаём курсор.\n\nТак читатель получает быструю ленту, а публикация не порождает лавину записей.",
      "starter": "",
      "code": false,
      "lang": "text"
    }
  ],
  "system-design:3": [
    {
      "title": "Sequence в чате",
      "task": "Клиент переподключился после обрыва. Как ему получить пропущенные сообщения и не потерять порядок?",
      "hint": "Серверный sequence на комнату, last_seq у клиента, запрос after_seq.",
      "solution": "SELECT id, seq, sender_id, body, sent_at\nFROM messages\nWHERE room_id = $1 AND seq > $2\nORDER BY seq ASC\nLIMIT 100;\n\nКлиент хранит last_seq и подтверждает получение. Время клиента не используется для порядка. При повторной доставке дедупликация по message_id.",
      "starter": "",
      "code": false,
      "lang": "sql"
    }
  ],
  "system-design:4": [
    {
      "title": "Идемпотентная отправка уведомлений",
      "task": "Событие может прийти дважды. Сделайте так, чтобы письмо не отправилось повторно, но временная ошибка провайдера ретраилась.",
      "hint": "Ключ event_id+channel, статус, retry только для временных ошибок.",
      "solution": "ok, err := rdb.SetNX(ctx, \"notify:\"+eventID+\":email\", \"1\", 24*time.Hour).Result()\nif err != nil { return err }\nif !ok { return nil } // уже обработано\n\nif err := send(ctx, msg); err != nil {\n    rdb.Del(ctx, key) // разрешить повтор\n    if isTemporary(err) { return err } // очередь повторит\n    return nil // постоянная ошибка — в DLQ\n}\n\nДля строгой гарантии храните статус в БД и используйте outbox.",
      "starter": "",
      "code": false,
      "lang": "go"
    }
  ],
  "algorithms:0": [
    {
      "title": "Оценить сложность",
      "task": "Для функции с двумя вложенными циклами по n и внутри — поиском в map, назовите время и память. Что изменится, если внутренний поиск заменить на сортировку и два указателя?",
      "hint": "Внешний и внутренний циклы дают O(n^2); map-поиск O(1). Сортировка O(n log n) плюс проход O(n).",
      "solution": "Время O(n^2), память O(n) на map. С сортировкой: O(n log n) на сортировку и O(n) на два указателя, память O(1) или O(n) в зависимости от сортировки. На интервью проговорите худший случай и константы.",
      "starter": "",
      "code": false,
      "lang": "text"
    }
  ],
  "algorithms:1": [
    {
      "title": "Сумма в отсортированном массиве",
      "task": "Дан отсортированный массив. Найдите два числа с суммой target за O(n) и O(1) памяти.",
      "hint": "Два указателя на концах.",
      "solution": "func twoSum(a []int, target int) (int,int) {\n    l,r := 0,len(a)-1\n    for l<r {\n        s:=a[l]+a[r]\n        if s==target { return l,r }\n        if s<target { l++ } else { r-- }\n    }\n    return -1,-1\n}",
      "starter": "func twoSum(a []int, target int) (int,int) {\n    // TODO\n    return -1,-1\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "algorithms:2": [
    {
      "title": "Группы анаграмм",
      "task": "Сгруппируйте строки-анаграммы. Оцените сложность.",
      "hint": "Ключ — отсортированные руны или счётчик частот.",
      "solution": "func group(words []string) [][]string {\n    m:=map[string][]string{}\n    for _,w:=range words {\n        r:=[]rune(w); sort.Slice(r,func(i,j int)bool{return r[i]<r[j]})\n        k:=string(r); m[k]=append(m[k],w)\n    }\n    out:=make([][]string,0,len(m))\n    for _,g:=range m { out=append(out,g) }\n    return out\n}\n\nO(n · k log k), где k — длина слова; память O(n·k).",
      "starter": "func group(words []string) [][]string {\n    // TODO\n    return nil\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "algorithms:3": [
    {
      "title": "Развернуть список",
      "task": "Разверните односвязный список итеративно, не создавая новый.",
      "hint": "prev, cur, next; на каждом шаге сохраняйте next.",
      "solution": "func reverse(head *ListNode) *ListNode {\n    var prev *ListNode\n    for head != nil {\n        next:=head.Next\n        head.Next=prev\n        prev=head\n        head=next\n    }\n    return prev\n}\n\nO(n) времени, O(1) памяти.",
      "starter": "type ListNode struct{ Val int; Next *ListNode }\n\nfunc reverse(head *ListNode) *ListNode {\n    // TODO\n    return head\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "algorithms:4": [
    {
      "title": "Кратчайший путь BFS",
      "task": "Найдите кратчайшее число рёбер от start до target в невзвешенном графе.",
      "hint": "Очередь и map расстояний; не добавляйте посещённые повторно.",
      "solution": "func shortest(g map[int][]int, start, target int) int {\n    dist:=map[int]int{start:0}\n    q:=[]int{start}\n    for len(q)>0 {\n        v:=q[0]; q=q[1:]\n        if v==target { return dist[v] }\n        for _,to:=range g[v] {\n            if _,ok:=dist[to]; ok { continue }\n            dist[to]=dist[v]+1; q=append(q,to)\n        }\n    }\n    return -1\n}",
      "starter": "func shortest(g map[int][]int, start, target int) int {\n    // TODO\n    return -1\n}",
      "code": true,
      "lang": "go"
    }
  ],
  "tooling:0": [
    {
      "title": "Прогнать линтеры",
      "task": "Напишите команду, которая форматирует код, запускает go vet и staticcheck, и падает при ошибке.",
      "hint": "gofmt -l проверяет без записи; используйте &&.",
      "solution": "gofmt -l . && go vet ./... && staticcheck ./...\n\nЕсли gofmt -l что-то вывел, код не отформатирован, и команда завершится ошибкой. В CI это блокирует merge.",
      "starter": "",
      "code": false,
      "lang": "bash"
    }
  ],
  "tooling:1": [
    {
      "title": "Makefile для тестов",
      "task": "Добавьте цели test и lint: тесты с -race -count=1, линтеры из предыдущего упражнения.",
      "hint": "PHONY и рецепты с табами.",
      "solution": "APP:=app\n.PHONY: test lint\n\ntest:\n\tgo test -race -count=1 ./...\n\nlint:\n\tgofmt -l . && go vet ./... && staticcheck ./...",
      "starter": "",
      "code": false,
      "lang": "make"
    }
  ],
  "tooling:2": [
    {
      "title": "Точка останова в Delve",
      "task": "Запустите dlv debug, поставьте breakpoint на main.main, выполните next и напечатайте переменную.",
      "hint": "dlv debug ./cmd/app, break main.main, continue, next, print.",
      "solution": "dlv debug ./cmd/app\n(dlv) break main.main\n(dlv) continue\n(dlv) next\n(dlv) print cfg\n(dlv) goroutines\n\nДля выхода — quit. Не оставляйте headless-отладчик на публичном порту.",
      "starter": "",
      "code": false,
      "lang": "bash"
    }
  ],
  "tooling:3": [
    {
      "title": "CI-workflow",
      "task": "Напишите GitHub Actions job: checkout, setup-go с кэшем, go test -race -count=1, go vet.",
      "hint": "actions/checkout@v4, actions/setup-go@v5, cache: true.",
      "solution": "name: ci\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-go@v5\n        with:\n          go-version: '1.23'\n          cache: true\n      - run: go test -race -count=1 ./...\n      - run: go vet ./...",
      "starter": "",
      "code": false,
      "lang": "yaml"
    }
  ],
  "tooling:4": [
    {
      "title": "Версия в бинарнике",
      "task": "Передайте версию и commit через -ldflags -X и выведите их по флагу --version.",
      "hint": "var version, commit = \"dev\", \"none\" в main; -X main.version=...",
      "solution": "// main.go\nvar version, commit = \"dev\", \"none\"\n\nfunc main() {\n    flag.Parse()\n    if *showVersion { fmt.Println(version, commit); return }\n}\n\n// сборка:\n// go build -trimpath -ldflags \"-X main.version=$(git describe --tags) -X main.commit=$(git rev-parse --short HEAD)\"",
      "starter": "package main\n\nvar version, commit = \"dev\", \"none\"\n\nfunc main() {\n    // TODO: флаг --version\n}",
      "code": true,
      "lang": "go"
    }
  ]
};
