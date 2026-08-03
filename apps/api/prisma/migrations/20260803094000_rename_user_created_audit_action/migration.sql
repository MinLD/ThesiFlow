-- Keep audit vocabulary aligned with global Account identity.
ALTER TYPE "AuditAction" RENAME VALUE 'USER_CREATED' TO 'ACCOUNT_CREATED';
