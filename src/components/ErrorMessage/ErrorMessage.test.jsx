import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

const testMassage = "Test error message";
describe("Error message component", () => {
  test("renders error message", () => {
    render(<ErrorMessage message={testMassage} />);

    expect(screen.getByText(testMassage)).toBeInTheDocument();
  });

  //   test("error massage contains styling class", () =>{});
});
