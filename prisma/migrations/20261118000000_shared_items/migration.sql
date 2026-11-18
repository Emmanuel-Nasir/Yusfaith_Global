-- CreateTable
CREATE TABLE "shared_items" (
    "collection" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shared_items_pkey" PRIMARY KEY ("collection","id")
);

-- CreateIndex
CREATE INDEX "shared_items_updated_at_idx" ON "shared_items"("updated_at");

-- Only the website's server may read or write (blocks Supabase's public API)
ALTER TABLE "shared_items" ENABLE ROW LEVEL SECURITY;
