# DeepShield AI

Plataforma SaaS fullstack para deteccao de deepfakes e analise forense multimidia.

## Stack

- Frontend: Next.js 15, React, TypeScript, Tailwind, Framer Motion, shadcn/ui
- Backend: FastAPI, Celery, Redis, PostgreSQL
- IA: OpenCV, FFmpeg, PyTorch, Whisper, librosa
- Banco: PostgreSQL (via Supabase opcional)

## Estrutura

- `frontend/` aplicacao Next.js
- `backend/` API FastAPI + workers

## Requisitos

- Docker + Docker Compose
- Node 20+ (para desenvolvimento local)
- Python 3.11+ (para desenvolvimento local)

## Como rodar com Docker

1. Copie as variaveis de ambiente:

```
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Suba os containers:

```
docker compose up --build
```

3. Aplicacao:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

## Migrations e seed

```
docker compose exec backend alembic upgrade head
docker compose exec backend python -c "from app.db.session import SessionLocal; from app.db.init_db import init_db; db=SessionLocal(); init_db(db); db.close()"
```

Conta seed:

- email: `admin@deepshield.ai`
- senha: `Admin123!`

## Endpoints principais

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/user/me`
- `POST /api/v1/upload/video`
- `GET /api/v1/analysis/{id}`
- `GET /api/v1/reports/{analysis_id}`

## Pipeline

1. Upload do video
2. Worker Celery processa o video
3. Scores e timeline salvos no banco
4. Relatorios PDF e JSON gerados

## Rotas chunked upload

- `POST /api/v1/upload/init`
- `POST /api/v1/upload/chunk`
- `POST /api/v1/upload/complete`

## Observacoes

- O pipeline de IA esta estruturado em `backend/app/services/analysis/pipeline.py`.
- Os resultados atuais sao amostras para demonstrar o fluxo.
- Para integrar Supabase, ajuste `DATABASE_URL`.
