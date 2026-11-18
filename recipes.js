/* Практические рецепты для backend-разработки на Go. */
window.GO_ROADMAP_RECIPES = [
  {
    "id": "json-handler",
    "title": "HTTP-обработчик с JSON и валидацией",
    "tag": "HTTP",
    "problem": "Нужен предсказуемый POST-обработчик: ограничить тело, разобрать JSON, проверить поля и вернуть правильный статус.",
    "steps": [
      "Ограничьте тело через http.MaxBytesReader, иначе огромный JSON съест память.",
      "Декодируйте в отдельную структуру запроса, а не в доменную модель.",
      "Проверяйте поля до записи ответа: после WriteHeader статус уже не изменить.",
      "Возвращайте 400 на битый JSON, 422 на бизнес-валидацию и 201 на создание."
    ],
    "code": "func createTask(w http.ResponseWriter, r *http.Request) {\n    r.Body = http.MaxBytesReader(w, r.Body, 1<<20)\n    var in struct {\n        Title string `json:\"title\"`\n    }\n    dec := json.NewDecoder(r.Body)\n    dec.DisallowUnknownFields()\n    if err := dec.Decode(&in); err != nil {\n        http.Error(w, \"invalid json\", http.StatusBadRequest)\n        return\n    }\n    in.Title = strings.TrimSpace(in.Title)\n    if in.Title == \"\" {\n        http.Error(w, \"title is required\", http.StatusUnprocessableEntity)\n        return\n    }\n\n    task, err := store.Create(r.Context(), in.Title)\n    if err != nil {\n        http.Error(w, \"internal error\", http.StatusInternalServerError)\n        return\n    }\n\n    w.Header().Set(\"Content-Type\", \"application/json\")\n    w.WriteHeader(http.StatusCreated)\n    _ = json.NewEncoder(w).Encode(task)\n}",
    "notes": [
      "DisallowUnknownFields полезен для публичного API, но ломает совместимость при добавлении полей клиентом.",
      "Не возвращайте текст внутренней ошибки клиенту: логируйте её, а наружу отдавайте общий message."
    ]
  },
  {
    "id": "config",
    "title": "Конфигурация из окружения с проверкой",
    "tag": "Конфиг",
    "problem": "Приложение должно падать на старте, если не задан обязательный параметр, и иметь безопасные значения по умолчанию.",
    "steps": [
      "Читайте окружение в одну структуру, а не по всему коду.",
      "Для чисел и длительностей используйте strconv и time.ParseDuration.",
      "Проверяйте обязательные поля и диапазоны до запуска сервера.",
      "Секреты не логируйте и не храните в репозитории."
    ],
    "code": "type Config struct {\n    Addr         string\n    DatabaseURL  string\n    LogLevel     slog.Level\n    ReadTimeout  time.Duration\n    WriteTimeout time.Duration\n}\n\nfunc LoadConfig() (Config, error) {\n    cfg := Config{\n        Addr:         env(\"ADDR\", \":8080\"),\n        DatabaseURL:  os.Getenv(\"DATABASE_URL\"),\n        ReadTimeout:  5 * time.Second,\n        WriteTimeout: 10 * time.Second,\n    }\n    if cfg.DatabaseURL == \"\" {\n        return cfg, errors.New(\"DATABASE_URL is required\")\n    }\n    if raw := os.Getenv(\"READ_TIMEOUT\"); raw != \"\" {\n        d, err := time.ParseDuration(raw)\n        if err != nil {\n            return cfg, fmt.Errorf(\"READ_TIMEOUT: %w\", err)\n        }\n        cfg.ReadTimeout = d\n    }\n    return cfg, nil\n}\n\nfunc env(key, fallback string) string {\n    if v := os.Getenv(key); v != \"\" {\n        return v\n    }\n    return fallback\n}",
    "notes": [
      "12-factor: один образ, разные окружения. Конфиг не пересобирает приложение.",
      "Проверка на старте лучше падения в первом запросе: ошибка видна сразу в логах деплоя."
    ]
  },
  {
    "id": "request-id",
    "title": "Request ID и структурные логи",
    "tag": "Наблюдаемость",
    "problem": "Каждый запрос должен иметь идентификатор, который виден в ответе и во всех логах обработчика.",
    "steps": [
      "Сгенерируйте короткий случайный ID или возьмите X-Request-ID от доверенного прокси.",
      "Положите его в контекст через неэкспортируемый ключ.",
      "Добавьте ID в заголовок ответа и в логгер запроса.",
      "Логируйте метод, путь, статус и длительность."
    ],
    "code": "type ctxKey struct{}\n\nfunc withRequestID(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        id := r.Header.Get(\"X-Request-ID\")\n        if id == \"\" {\n            buf := make([]byte, 8)\n            _, _ = rand.Read(buf)\n            id = hex.EncodeToString(buf)\n        }\n        ctx := context.WithValue(r.Context(), ctxKey{}, id)\n        w.Header().Set(\"X-Request-ID\", id)\n        next.ServeHTTP(w, r.WithContext(ctx))\n    })\n}\n\nfunc requestID(ctx context.Context) string {\n    id, _ := ctx.Value(ctxKey{}).(string)\n    return id\n}\n\nfunc logging(next http.Handler, log *slog.Logger) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        start := time.Now()\n        rec := &statusRecorder{ResponseWriter: w, status: 200}\n        next.ServeHTTP(rec, r)\n        log.Info(\"request\",\n            \"id\", requestID(r.Context()),\n            \"method\", r.Method,\n            \"path\", r.URL.Path,\n            \"status\", rec.status,\n            \"dur\", time.Since(start),\n        )\n    })\n}",
    "notes": [
      "statusRecorder перехватывает WriteHeader, чтобы залогировать реальный статус.",
      "ID из недоверенного заголовка принимайте только за обратным прокси, иначе клиент подделает логи."
    ]
  },
  {
    "id": "errors-http",
    "title": "Типизированные ошибки и HTTP-статусы",
    "tag": "Ошибки",
    "problem": "Сервис возвращает разные ошибки, а HTTP-слой должен превратить их в 400, 404, 409 и 500 без строковых сравнений.",
    "steps": [
      "Заведите тип AppError с кодом, статусом и исходной ошибкой.",
      "Оборачивайте ошибку через %w, чтобы сохранить цепочку.",
      "В обработчике используйте errors.As и выбирайте статус.",
      "Неизвестные ошибки логируйте и отдавайте 500 без деталей."
    ],
    "code": "type AppError struct {\n    Status int\n    Code   string\n    Err    error\n}\n\nfunc (e *AppError) Error() string { return e.Code + \": \" + e.Err.Error() }\nfunc (e *AppError) Unwrap() error { return e.Err }\n\nfunc writeError(w http.ResponseWriter, err error) {\n    var app *AppError\n    if errors.As(err, &app) {\n        w.Header().Set(\"Content-Type\", \"application/json\")\n        w.WriteHeader(app.Status)\n        _ = json.NewEncoder(w).Encode(map[string]string{\"error\": app.Code})\n        return\n    }\n    slog.Error(\"unhandled\", \"err\", err)\n    http.Error(w, \"internal error\", http.StatusInternalServerError)\n}\n\nvar ErrNotFound = &AppError{Status: 404, Code: \"not_found\", Err: errors.New(\"not found\")}",
    "notes": [
      "Ошибка — значение: её можно обернуть, сравнить и доставить до HTTP-слоя.",
      "Код для клиента и текст для логов — разные вещи. Клиенту нужен стабильный code, а не stack trace."
    ]
  },
  {
    "id": "pagination",
    "title": "Пагинация с безопасными границами",
    "tag": "API",
    "problem": "Список может быть большим. Нужны limit, offset, общее количество и защита от отрицательных значений.",
    "steps": [
      "Разбирайте query-параметры через strconv с дефолтами.",
      "Ограничьте максимум limit, например 100.",
      "Возвращайте items, total, limit и offset.",
      "Для больших таблиц используйте keyset-пагинацию по id или created_at."
    ],
    "code": "func parsePage(r *http.Request) (limit, offset int) {\n    limit, _ = strconv.Atoi(r.URL.Query().Get(\"limit\"))\n    offset, _ = strconv.Atoi(r.URL.Query().Get(\"offset\"))\n    if limit <= 0 {\n        limit = 20\n    }\n    if limit > 100 {\n        limit = 100\n    }\n    if offset < 0 {\n        offset = 0\n    }\n    return limit, offset\n}\n\nfunc listTasks(w http.ResponseWriter, r *http.Request) {\n    limit, offset := parsePage(r)\n    items, total, err := store.List(r.Context(), limit, offset)\n    if err != nil {\n        writeError(w, err)\n        return\n    }\n    w.Header().Set(\"Content-Type\", \"application/json\")\n    _ = json.NewEncoder(w).Encode(map[string]any{\n        \"items\":  items,\n        \"total\":  total,\n        \"limit\":  limit,\n        \"offset\": offset,\n    })\n}",
    "notes": [
      "OFFSET на миллионах строк замедляется: СУБД всё равно читает пропущенные строки.",
      "Keyset: WHERE (created_at, id) < ($1, $2) ORDER BY created_at DESC, id DESC LIMIT $3."
    ]
  },
  {
    "id": "http-timeout",
    "title": "Таймаут внешнего HTTP-вызова",
    "tag": "HTTP-клиент",
    "problem": "Внешний сервис может зависнуть. Запрос должен завершиться по дедлайну и освободить горутину.",
    "steps": [
      "Создайте http.Client с общим Timeout.",
      "Передайте контекст запроса через NewRequestWithContext.",
      "Проверяйте ctx.Err() и возвращайте понятную ошибку.",
      "Закрывайте тело ответа и ограничивайте его размер."
    ],
    "code": "var client = &http.Client{Timeout: 5 * time.Second}\n\nfunc fetchUser(ctx context.Context, id int) (*User, error) {\n    ctx, cancel := context.WithTimeout(ctx, 2*time.Second)\n    defer cancel()\n\n    url := fmt.Sprintf(\"https://api.example.com/users/%d\", id)\n    req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)\n    if err != nil {\n        return nil, err\n    }\n    resp, err := client.Do(req)\n    if err != nil {\n        return nil, fmt.Errorf(\"fetch user %d: %w\", id, err)\n    }\n    defer resp.Body.Close()\n\n    if resp.StatusCode != http.StatusOK {\n        return nil, fmt.Errorf(\"fetch user %d: status %d\", id, resp.StatusCode)\n    }\n    var user User\n    if err := json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(&user); err != nil {\n        return nil, fmt.Errorf(\"decode user %d: %w\", id, err)\n    }\n    return &user, nil\n}",
    "notes": [
      "Client.Timeout покрывает весь запрос, а контекст позволяет отменить его раньше.",
      "Всегда закрывайте Body, иначе соединение не вернётся в пул."
    ]
  },
  {
    "id": "retry",
    "title": "Повтор с экспоненциальной задержкой",
    "tag": "Надёжность",
    "problem": "Сетевой вызов иногда падает временно. Нужно повторить его, но не бесконечно и не при отмене.",
    "steps": [
      "Повторяйте только временные ошибки: сеть, 429 и 5xx.",
      "Увеличивайте задержку и добавляйте jitter, чтобы не бить сервис синхронно.",
      "Проверяйте ctx.Done() перед каждой попыткой и во время ожидания.",
      "Ограничьте число попыток и общий дедлайн."
    ],
    "code": "func retry(ctx context.Context, attempts int, fn func(context.Context) error) error {\n    var err error\n    for i := 0; i < attempts; i++ {\n        if err = fn(ctx); err == nil {\n            return nil\n        }\n        if !isRetryable(err) {\n            return err\n        }\n        delay := time.Duration(1<<i) * 100 * time.Millisecond\n        delay += time.Duration(rand.Int63n(int64(delay / 2)))\n        select {\n        case <-ctx.Done():\n            return ctx.Err()\n        case <-time.After(delay):\n        }\n    }\n    return fmt.Errorf(\"after %d attempts: %w\", attempts, err)\n}\n\nfunc isRetryable(err error) bool {\n    return true // замените на проверку сети, 429 и 5xx\n}",
    "notes": [
      "Не повторяйте POST, если операция не идемпотентна, без idempotency key.",
      "time.After в цикле создаёт таймеры; для большого числа попыток используйте time.NewTimer и Stop."
    ]
  },
  {
    "id": "rate-limit",
    "title": "Ограничение частоты запросов",
    "tag": "Безопасность",
    "problem": "Публичный API нужно защитить от всплесков и перебора. Простое ограничение — token bucket на клиента.",
    "steps": [
      "Заведите limiter на ключ: IP, пользователь или токен.",
      "Проверяйте Allow() до вызова обработчика.",
      "Возвращайте 429 и Retry-After.",
      "Храните лимитеры в map с mutex и очищайте старые записи."
    ],
    "code": "type Limiters struct {\n    mu sync.Mutex\n    m  map[string]*rate.Limiter\n}\n\nfunc (l *Limiters) get(key string) *rate.Limiter {\n    l.mu.Lock()\n    defer l.mu.Unlock()\n    lim, ok := l.m[key]\n    if !ok {\n        lim = rate.NewLimiter(5, 10) // 5 rps, burst 10\n        l.m[key] = lim\n    }\n    return lim\n}\n\nfunc (l *Limiters) middleware(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        key := r.RemoteAddr\n        if !l.get(key).Allow() {\n            w.Header().Set(\"Retry-After\", \"1\")\n            http.Error(w, \"too many requests\", http.StatusTooManyRequests)\n            return\n        }\n        next.ServeHTTP(w, r)\n    })\n}",
    "notes": [
      "За балансировщиком r.RemoteAddr — адрес прокси; берите реальный IP из доверенного заголовка.",
      "Для нескольких инстансов нужен общий счётчик: Redis или другой внешний store."
    ]
  },
  {
    "id": "tx",
    "title": "Транзакция с откатом",
    "tag": "База данных",
    "problem": "Несколько изменений должны примениться атомарно. Ошибка на любом шаге откатывает всё.",
    "steps": [
      "Начните транзакцию через BeginTx с контекстом.",
      "Сразу поставьте defer Rollback: после Commit он безопасен.",
      "Проверяйте ошибки каждого Exec и количество затронутых строк.",
      "Делайте Commit последним и возвращайте его ошибку."
    ],
    "code": "func transfer(ctx context.Context, db *sql.DB, from, to int, amount int64) error {\n    tx, err := db.BeginTx(ctx, nil)\n    if err != nil {\n        return err\n    }\n    defer tx.Rollback()\n\n    res, err := tx.ExecContext(ctx,\n        \"UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $1\",\n        amount, from)\n    if err != nil {\n        return err\n    }\n    if n, _ := res.RowsAffected(); n != 1 {\n        return errors.New(\"insufficient funds or account not found\")\n    }\n\n    res, err = tx.ExecContext(ctx,\n        \"UPDATE accounts SET balance = balance + $1 WHERE id = $2\", amount, to)\n    if err != nil {\n        return err\n    }\n    if n, _ := res.RowsAffected(); n != 1 {\n        return errors.New(\"target account not found\")\n    }\n    return tx.Commit()\n}",
    "notes": [
      "Проверка balance >= $1 в UPDATE защищает от ухода в минус без отдельного SELECT.",
      "Rollback после успешного Commit возвращает sql.ErrTxDone, поэтому ошибку rollback обычно игнорируют."
    ]
  },
  {
    "id": "repository",
    "title": "Репозиторий за интерфейсом",
    "tag": "Архитектура",
    "problem": "Сервис не должен зависеть от PostgreSQL напрямую. Нужен узкий интерфейс, который легко подменить в тестах.",
    "steps": [
      "Объявите интерфейс в пакете service, рядом с потребителем.",
      "Оставьте только методы, которые реально нужны сервису.",
      "Реализацию SQL положите в отдельный пакет store.",
      "В тестах используйте фейк, а SQL проверяйте интеграционно."
    ],
    "code": "type TaskStore interface {\n    Create(ctx context.Context, title string) (Task, error)\n    Get(ctx context.Context, id int) (Task, error)\n}\n\ntype Service struct {\n    store TaskStore\n}\n\nfunc (s *Service) Create(ctx context.Context, title string) (Task, error) {\n    title = strings.TrimSpace(title)\n    if title == \"\" {\n        return Task{}, ErrInvalidTitle\n    }\n    return s.store.Create(ctx, title)\n}\n\n// fake для теста\ntype fakeStore struct {\n    created []string\n}\n\nfunc (f *fakeStore) Create(_ context.Context, title string) (Task, error) {\n    f.created = append(f.created, title)\n    return Task{ID: 1, Title: title}, nil\n}",
    "notes": [
      "Интерфейс на стороне потребителя не тянет за собой SQL-драйвер в тестах.",
      "Не делайте интерфейс на все методы хранилища: сервису нужны единицы."
    ]
  },
  {
    "id": "worker-pool",
    "title": "Worker pool с отменой и ошибками",
    "tag": "Конкурентность",
    "problem": "Нужно обработать много задач ограниченным числом воркеров и остановиться при первой фатальной ошибке.",
    "steps": [
      "Создайте канал задач и фиксированное число воркеров.",
      "Используйте errgroup.WithContext, чтобы ошибка отменяла остальных.",
      "Закрывайте канал задач после отправки.",
      "Дожидайтесь группы и только потом читайте результаты."
    ],
    "code": "func process(ctx context.Context, items []int) error {\n    g, ctx := errgroup.WithContext(ctx)\n    jobs := make(chan int)\n\n    for i := 0; i < 8; i++ {\n        g.Go(func() error {\n            for id := range jobs {\n                if err := handle(ctx, id); err != nil {\n                    return fmt.Errorf(\"handle %d: %w\", id, err)\n                }\n            }\n            return nil\n        })\n    }\n\n    g.Go(func() error {\n        defer close(jobs)\n        for _, id := range items {\n            select {\n            case <-ctx.Done():\n                return ctx.Err()\n            case jobs <- id:\n            }\n        }\n        return nil\n    })\n\n    return g.Wait()\n}",
    "notes": [
      "При ошибке errgroup отменяет контекст, но воркеры должны проверять его внутри handle.",
      "Без ограничения числа воркеров пул превращается в лавину горутин."
    ]
  },
  {
    "id": "shutdown",
    "title": "Graceful shutdown с очисткой ресурсов",
    "tag": "Эксплуатация",
    "problem": "При SIGTERM сервис должен перестать принимать запросы, дождаться текущих и закрыть БД.",
    "steps": [
      "Создайте signal.NotifyContext для SIGINT и SIGTERM.",
      "Запустите ListenAndServe в горутине.",
      "После сигнала вызовите Shutdown с таймаутом.",
      "Закройте пул БД и фоновые воркеры, затем выходите."
    ],
    "code": "func run() error {\n    ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)\n    defer stop()\n\n    db, err := sql.Open(\"pgx\", os.Getenv(\"DATABASE_URL\"))\n    if err != nil {\n        return err\n    }\n    defer db.Close()\n\n    srv := &http.Server{\n        Addr:         \":8080\",\n        Handler:      router(db),\n        ReadTimeout:  5 * time.Second,\n        WriteTimeout: 10 * time.Second,\n    }\n\n    errCh := make(chan error, 1)\n    go func() {\n        errCh <- srv.ListenAndServe()\n    }()\n\n    select {\n    case err := <-errCh:\n        return err\n    case <-ctx.Done():\n    }\n\n    shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)\n    defer cancel()\n    return srv.Shutdown(shutdownCtx)\n}",
    "notes": [
      "Shutdown не закрывает hijacked-соединения; для WebSocket нужен отдельный учёт.",
      "defer db.Close сработает после Shutdown, когда текущие запросы уже завершены."
    ]
  }
];
