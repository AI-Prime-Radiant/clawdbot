import { describe, expect, it } from "vitest";

import { extractMentions, normalizeFeishuMentions } from "./inbound.js";

describe("feishu/inbound mentions", () => {
  it("extracts mention records", () => {
    const mentions = extractMentions([null, { id: { open_id: "ou_1" } }, "x", 42]);
    expect(mentions).toEqual([{ id: { open_id: "ou_1" } }]);
  });

  it("normalizes mention details with placeholder keys", () => {
    const mentions = [
      {
        key: "@_user_1",
        id: { open_id: "ou_123", user_id: "u_123", union_id: "un_123" },
        name: "Alice",
      },
      {
        id: { open_id: "ou_456", user_id: "u_456" },
        user_name: "Bob",
      },
    ];
    const result = normalizeFeishuMentions({
      mentions,
      text: "hi @_user_1 and @_user_2",
    });

    expect(result[0]).toMatchObject({
      key: "@_user_1",
      openId: "ou_123",
      userId: "u_123",
      unionId: "un_123",
      name: "Alice",
    });
    expect(result[1]).toMatchObject({
      key: "@_user_2",
      openId: "ou_456",
      userId: "u_456",
      name: "Bob",
    });
  });

  it("marks @all mentions", () => {
    const result = normalizeFeishuMentions({
      mentions: [{ id: { open_id: "all" }, key: "@_user_1" }],
      text: "@_user_1",
    });

    expect(result[0]?.isAll).toBe(true);
  });
});
