import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { admin, apiEnv, corePath, databasePath, e2eDir } from "./env";

/** Fresh database with the demo catalogue and an administrator, before the servers start. */
export default function globalSetup() {
  fs.mkdirSync(e2eDir, { recursive: true });
  fs.rmSync(databasePath, { force: true });
  fs.writeFileSync(databasePath, "");

  const artisan = (...args: string[]) =>
    execFileSync("php", ["artisan", ...args], { cwd: corePath, env: { ...process.env, ...apiEnv }, stdio: "pipe" });

  artisan("migrate", "--force");
  artisan("db:seed", "--class=DemoCatalogSeeder", "--force");
  artisan("admin:create", admin.email, `--password=${admin.password}`, "--name=E2E Admin");
  artisan("cache:clear");
}
