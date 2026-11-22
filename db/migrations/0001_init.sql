create extension if not exists "pgcrypto";
create extension if not exists citext;
create schema if not exists core;
create schema if not exists ledger;
create schema if not exists scan;

create table core.users (
  id uuid primary key default gen_random_uuid(),
  email citext unique,
  wallet text unique,
  password_hash text,
  totp_secret text,
  created_at timestamptz not null default now()
);

create table core.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id) on delete cascade,
  kind text not null check (kind in ('user_real','house','treasury')),
  currency text not null default 'SLD',
  created_at timestamptz not null default now()
);
create unique index accounts_one_real on core.accounts (user_id) where kind = 'user_real';

create table ledger.entries (
  id bigserial primary key,
  account_id uuid not null references core.accounts(id),
  delta numeric(38,18) not null,
  ref text not null,
  idempotency_key text not null,
  created_at timestamptz not null default now()
);
create unique index entries_idem on ledger.entries (idempotency_key);

create table ledger.holds (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references core.accounts(id),
  amount numeric(38,18) not null check (amount > 0),
  ref text not null,
  released boolean not null default false,
  created_at timestamptz not null default now()
);

create table ledger.bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references core.users(id),
  game text not null,
  stake numeric(38,18) not null,
  multiplier numeric(38,18),
  payout numeric(38,18),
  server_seed text not null,
  seed_hash text not null,
  client_seed text not null,
  nonce bigint not null,
  created_at timestamptz not null default now()
);

create table scan.tokens (
  mint text primary key,
  ticker text not null,
  name text,
  dev text,
  state text not null default 'new' check (state in ('new','filled','migrating','dead')),
  mcap_usd numeric(38,2),
  liq_usd numeric(38,2),
  holders int,
  top10_pct numeric(6,3),
  dev_pct numeric(6,3),
  first_seen timestamptz not null default now(),
  migrated_at timestamptz
);
create index tokens_state_seen on scan.tokens (state, first_seen desc);

