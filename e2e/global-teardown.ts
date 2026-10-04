import { execFileSync } from "node:child_process";

/** Stopping Playwright ends the docker CLI, not the container it started. */
export default function globalTeardown() {
  try {
    execFileSync("docker", ["rm", "-f", "cc-e2e-stripe-mock"], { stdio: "ignore" });
  } catch {
    // Already gone.
  }
}
