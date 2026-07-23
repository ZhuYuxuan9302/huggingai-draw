-- CreateTable
CREATE TABLE "users" (
    "oidc_id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "picture" TEXT,
    "granted_balance_raw" BIGINT NOT NULL DEFAULT 0,
    "extra_draws" INTEGER NOT NULL DEFAULT 0,
    "auto_draws" INTEGER NOT NULL DEFAULT 0,
    "used_draws" INTEGER NOT NULL DEFAULT 0,
    "total_won_raw" BIGINT NOT NULL DEFAULT 0,
    "total_rolls" INTEGER NOT NULL DEFAULT 0,
    "last_quota_raw" BIGINT,
    "last_synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "draw_records" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "tier_key" TEXT NOT NULL,
    "amount_raw" BIGINT NOT NULL,
    "source" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "draw_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_logs" (
    "id" BIGSERIAL NOT NULL,
    "actor_id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "before_value" TEXT NOT NULL,
    "after_value" TEXT NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_oidc_id_key" ON "users"("oidc_id");

-- CreateIndex
CREATE INDEX "draw_records_user_id_idx" ON "draw_records"("user_id");

-- CreateIndex
CREATE INDEX "draw_records_batch_id_idx" ON "draw_records"("batch_id");

-- CreateIndex
CREATE INDEX "draw_records_created_at_idx" ON "draw_records"("created_at");

-- CreateIndex
CREATE INDEX "admin_logs_target_id_idx" ON "admin_logs"("target_id");

-- CreateIndex
CREATE INDEX "admin_logs_created_at_idx" ON "admin_logs"("created_at");

-- AddForeignKey
ALTER TABLE "draw_records" ADD CONSTRAINT "draw_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("oidc_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_logs" ADD CONSTRAINT "admin_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("oidc_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_logs" ADD CONSTRAINT "admin_logs_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "users"("oidc_id") ON DELETE RESTRICT ON UPDATE CASCADE;
