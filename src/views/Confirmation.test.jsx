import { beforeEach, describe, vi } from "vitest";

describe("Confirmation Component - user able to view booking confirmation ", () => {
  const mockConfirmation = {
    id: "1",
    when: "2024-12-19T16:00",
    people: "2",
    lanes: "1",
    price: 340,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.sessionStorage = {
      getItem: vi.fn(),
    };
  });
});
