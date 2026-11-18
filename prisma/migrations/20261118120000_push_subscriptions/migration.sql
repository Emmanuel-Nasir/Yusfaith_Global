-- CreateTable
CREATE TABLE "push_subscriptions" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "orderId" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "push_subscriptions_endpoint_audience_orderId_key" ON "push_subscriptions"("endpoint", "audience", "orderId");

-- CreateIndex
CREATE INDEX "push_subscriptions_audience_orderId_idx" ON "push_subscriptions"("audience", "orderId");

-- Only the website's server may read or write
ALTER TABLE "push_subscriptions" ENABLE ROW LEVEL SECURITY;
