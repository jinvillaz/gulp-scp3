import assert from "node:assert";
import { ScpClient } from "../src/client";

describe("src/ScpClient", () => {
  it("constructs without errors", () => {
    const client = new ScpClient({ host: "test", username: "test" });
    assert.ok(client);
  });

  it("sftp is async function", async () => {
    const client = new ScpClient({ host: "test", username: "test" });
    assert.ok(typeof client.sftp === "function");
    // Skip real sftp for unit test
    assert.ok(client);
  });

  it("closes without crash", () => {
    const client = new ScpClient({ host: "test", username: "test" });
    client.close();
  });

  it("supports privateKey option", () => {
    const client = new ScpClient({
      host: "test",
      username: "test",
      privateKey: "/path/to/key",
    });
    assert.ok(client);
  });
});
