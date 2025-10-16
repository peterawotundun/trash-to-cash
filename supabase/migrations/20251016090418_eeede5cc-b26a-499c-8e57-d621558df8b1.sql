-- Delete all data except locations
DELETE FROM withdrawals;
DELETE FROM transactions;
DELETE FROM profiles WHERE id IN (SELECT id FROM auth.users);