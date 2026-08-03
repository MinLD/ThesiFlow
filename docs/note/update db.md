 Khi đổi apps/api/prisma/schema.prisma, chạy theo thứ tự:

  npm run db:migrate

  Nó hỏi tên migration, nhập ví dụ:

  phase_02_global_identity

  Sau đó:

  npm run prisma:generate --workspace apps/api
  npm run db:validate
  npm run typecheck --workspace apps/api

  Bản 1 dòng tạo migration có tên luôn:

  npm run db:migrate -- --name ten_migration

  Không chạy:

  npm i --save-dev prisma@latest

  Đó là update package, không phải migrate DB.