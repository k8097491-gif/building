# Campus IT Helpdesk

Полноценное приложение для поддержки студентов и сотрудников университета: посетитель описывает проблему, система направляет обращение нужной группе, а участники видят историю, сроки и следующий шаг.

## Что умеет приложение

- Регистрация и вход с сессионной cookie `HttpOnly`; роли: requester, specialist, dispatcher, manager и admin.
- Создание, просмотр, поиск, фильтрация, изменение и удаление обращений с приоритетом и целевым сроком.
- Назначение специалиста, смена статуса, публичные ответы и внутренние заметки, решение, оценка и история действий.
- Уведомления, обновления открытой карточки через Server-Sent Events и справочные статьи.
- Аналитика по обращениям через отдельный Python API; видимость ограничена ролью пользователя.
- Интерфейс для телефона и компьютера, светлая и тёмная темы, клавиатурная навигация и анимация GSAP с поддержкой `prefers-reduced-motion`.
- REST API, GraphQL и OpenAPI спецификация.

## Стек

| Задача | Технологии |
| --- | --- |
| Веб-интерфейс | React, Vite, Tailwind CSS, React Router, TanStack Query, GSAP |
| Основной API | Node.js 24, Express, Zod, JWT, REST, GraphQL |
| Аналитика | Python 3.13, FastAPI |
| Данные обращений и аналитики | PostgreSQL |
| Пользователи и сессии | MySQL |
| История событий | MongoDB; PostgreSQL outbox для надёжной доставки |
| Локальная среда | Docker Compose |

В проекте оставлены технологии, которые решают отдельные задачи. Vue, Angular, jQuery, Bootstrap и дополнительные серверные языки не добавлены как дублирующие реализации.

## Запуск всего приложения

Требуются Docker Desktop с Compose и доступ к интернету при первой загрузке образов.

```bash
cp .env.example .env
```

Для локального запуска сгенерируйте новый секрет и замените `JWT_SECRET` в `.env` строкой длиной не менее 32 символов. Остальные значения в `.env.example` предназначены только для локальной демонстрации.

```bash
docker compose up --build
```

Откройте [http://localhost:3000](http://localhost:3000). Проверка состояния сервисов: [http://localhost:3000/health](http://localhost:3000/health). Для остановки используйте `Ctrl+C`; данные остаются в Docker volumes. Полный сброс локальной базы данных:

```bash
docker compose down -v
```

При `DEMO_MODE=true` создаются вымышленные демонстрационные пользователи. Пароль задаётся переменной `DEMO_PASSWORD` в `.env`. Для публичного развёртывания выключите демонстрационный режим, замените все секреты и пароли баз данных, включите HTTPS и задайте `COOKIE_SECURE=true`. Не отправляйте `.env` в репозиторий.

## Разработка без контейнера приложения

Docker Compose поднимает базы данных и сервисы, поэтому для отдельного Vite-разработчика остановите Compose API и аналитику, оставив базы запущенными:

```bash
docker compose up -d postgres mysql mongodb
corepack enable
pnpm install
python3 -m venv .venv
source .venv/bin/activate
pip install -r services/analytics/requirements.txt
pnpm dev
```

Откройте [http://localhost:5173](http://localhost:5173). Команда запускает Vite, Node API и Python analytics. Перед ней должны быть настроены адреса сервисов из `.env.example`.

## Проверки

```bash
pnpm test                 # модульные тесты Node.js
pnpm test:python          # модульные тесты аналитики
pnpm lint                 # ESLint
pnpm build                # production-сборка интерфейса
```

После `docker compose up --build` проверка баз и сквозные API-сценарии запускаются так:

```bash
docker compose exec -T api node --test server/tests/integration.js
docker compose exec -T api node server/tests/smoke.js
```

GitHub Actions запускает модульные проверки, сборку, Docker Compose, проверку БД и API smoke-тест на каждый push и pull request.

## API

- REST: `/api` — вход, профиль, пользователи, обращения, уведомления, категории и аналитика.
- GraphQL: `/graphql`.
- OpenAPI: `/api/openapi.json`.
- Health: `/health` и `/health/live`.
- Поток обновлений: `/events` (с авторизацией сессией).

## Загрузка в GitHub

Создайте пустой репозиторий без автоматически добавленных README и лицензии, затем в каталоге проекта выполните:

```bash
git init
git add .
git status
git commit -m "Build Campus IT Helpdesk"
git branch -M main
git remote add origin https://github.com/<username>/<repository>.git
git push -u origin main
```

Перед `git add` убедитесь, что `.env` не появился среди файлов. Он добавлен в `.gitignore`; публикуйте только `.env.example`.

Все демонстрационные имена и обращения вымышлены. Перед публичным развёртыванием задайте собственные секреты, домен, HTTPS и политику резервного копирования.

## Структура

```text
client/                 React-приложение и стили
server/                 Express API, авторизация и бизнес-логика
services/analytics/     Python/FastAPI аналитический сервис
migrations/             SQL-схемы PostgreSQL и MySQL
docs/openapi.json       Спецификация REST API
.github/workflows/      CI-проверки для GitHub Actions
docker-compose.yml      Локальная среда: API, аналитика и три базы данных
```
