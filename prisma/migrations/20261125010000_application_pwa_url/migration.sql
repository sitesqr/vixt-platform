-- Adiciona URL da PWA instalável por aplicativo (download apenas no celular).
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "pwaUrl" VARCHAR(800);
