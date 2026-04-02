---
title: NeuroScan API
emoji: 🧠
colorFrom: cyan
colorTo: blue
sdk: docker
pinned: false
app_port: 7860
---

# NeuroScan Flask API

REST API backend for the NeuroScan Brain Tumor Detector.

## Endpoints

- `GET /api/health` — Check if the API and model are loaded
- `POST /api/analyze` — Upload an MRI image and get a diagnosis

## Usage

```bash
curl https://mohdaltamish-neuroscan-api.hf.space/api/health
```
