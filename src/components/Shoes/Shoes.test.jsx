import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Shoes from "./Shoes";

describe("Shoes Component", () => {
  const mockUpdateSize = vi.fn();
  const mockAddShoe = vi.fn();
  const mockRemoveShoe = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders shoe size inputs", () => {
    const mockShoes = [{ id: "1", size: "42" }];
    render(
      <Shoes
        updateSize={mockUpdateSize}
        addShoe={mockAddShoe}
        removeShoe={mockRemoveShoe}
        shoes={mockShoes}
      />
    );

    expect(screen.getByLabelText(/shoe size \/ person 1/i)).toBeInTheDocument();
  });

  test("adds new shoe field", () => {
    const mockShoes = [{ id: "1", size: "42" }];
    render(
      <Shoes
        updateSize={mockUpdateSize}
        addShoe={mockAddShoe}
        removeShoe={mockRemoveShoe}
        shoes={mockShoes}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "+" }));
    expect(mockAddShoe).toHaveBeenCalled();
  });

  test("removes specific shoe field", () => {
    const mockShoes = [
      { id: "1", size: "42" },
      { id: "2", size: "44" },
    ];
    render(
      <Shoes
        updateSize={mockUpdateSize}
        addShoe={mockAddShoe}
        removeShoe={mockRemoveShoe}
        shoes={mockShoes}
      />
    );

    const removeButtons = screen.getAllByRole("button", { name: "-" });
    fireEvent.click(removeButtons[0]);
    expect(mockRemoveShoe).toHaveBeenCalledWith("1");
  });

  test("update shoe size", () => {
    const mockShoes = [{ id: "1", size: "" }];
    render(
      <Shoes
        updateSize={mockUpdateSize}
        addShoe={mockAddShoe}
        removeShoe={mockRemoveShoe}
        shoes={mockShoes}
      />
    );

    const shoeInput = screen.getByLabelText(/shoe size/i);
    fireEvent.change(shoeInput, { target: { value: "42" } });
    expect(mockUpdateSize).toHaveBeenCalled();
  });
});
