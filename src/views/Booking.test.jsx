import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Booking from "./Booking";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Booking View", () => {
  /*  const bookingData = {
    date: "2024-12-19",
    time: "16:00",
    people: "2",
    lanes: "1",
    shoeSize: "44",
  };

  const expectedConfirmationData = {
    when: "2024-12-19T16:00",
    lanes: "1",
    people: "2",
    shoes: ["44", "44"],
    price: 340,
    id: "1",
  }; */

  beforeEach(() => {
    vi.clearAllMocks();
    global.sessionStorage = {
      setItem: vi.fn(),
    };
  });

  // --- Successful booking flow ---
  describe("Successful booking", () => {
    test("Submits booking with correct data and saves to storage", async () => {
      render(<Booking />, { wrapper: BrowserRouter });

      fireEvent.change(screen.getByLabelText(/date/i), {
        target: { value: "2024-12-19" },
      });
      fireEvent.change(screen.getByLabelText(/time/i), {
        target: { value: "16:00" },
      });
      fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
        target: { value: "2" },
      });
      fireEvent.change(screen.getByLabelText(/number of lanes/i), {
        target: { value: "1" },
      });

      // Shoes
      fireEvent.click(screen.getByRole("button", { name: "+" }));
      fireEvent.click(screen.getByRole("button", { name: "+" }));
      const shoeInputs = screen.getAllByLabelText(/shoe size/i);

      fireEvent.change(shoeInputs[0], { target: { value: "44" } });
      fireEvent.change(shoeInputs[1], { target: { value: "44" } });

      fireEvent.click(screen.getByRole("button", { name: /strIIIIIike!/i }));

      const expectedBookingData = {
        when: "2024-12-19T16:00",
        lanes: "1",
        people: "2",
        shoes: ["44", "44"],
        price: 340,
        id: "1",
        //   active: true,
      };

      await waitFor(() => {
        expect(sessionStorage.setItem).toHaveBeenCalledWith(
          "confirmation",
          JSON.stringify(expectedBookingData)
        );

        expect(mockNavigate).toBeCalledWith("/confirmation", {
          state: {
            confirmationDetails: expectedBookingData,
          },
        });
      });
    });
    test("completes booking after removing extra shoe field", async () => {
      render(<Booking />, { wrapper: BrowserRouter });

      fireEvent.change(screen.getByLabelText(/date/i), {
        target: { value: "2024-12-19" },
      });
      fireEvent.change(screen.getByLabelText(/time/i), {
        target: { value: "16:00" },
      });
      fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
        target: { value: "2" },
      });
      fireEvent.change(screen.getByLabelText(/number of lanes/i), {
        target: { value: "1" },
      });

      fireEvent.click(screen.getByRole("button", { name: "+" }));
      fireEvent.click(screen.getByRole("button", { name: "+" }));
      fireEvent.click(screen.getByRole("button", { name: "+" }));

      const removeButtons = screen.getAllByRole("button", { name: "-" });
      fireEvent.click(removeButtons[2]);

      const shoeInputs = screen.getAllByLabelText(/shoe size/i);
      fireEvent.change(shoeInputs[0], { target: { value: "44" } });
      fireEvent.change(shoeInputs[1], { target: { value: "42" } });

      fireEvent.click(screen.getByRole("button", { name: /strIIIIIike!/i }));

      const expectedBookingData = {
        when: "2024-12-19T16:00",
        lanes: "1",
        people: "2",
        shoes: ["44", "42"],
        price: 340,
        id: "1",
        // active: true,
      };

      await waitFor(() => {
        expect(sessionStorage.setItem).toHaveBeenCalledWith(
          "confirmation",
          JSON.stringify(expectedBookingData)
        );

        expect(mockNavigate).toBeCalledWith("/confirmation", {
          state: {
            confirmationDetails: expectedBookingData,
          },
        });
      });
    });
  });

  // --- Booking with missing fields or missmatching data ---
  describe("Error handling", () => {
    test("error when required fields missing", async () => {
      render(<Booking />, { wrapper: BrowserRouter });

      fireEvent.click(screen.getByRole("button", { name: /strIIIIIike!/i }));

      expect(
        await screen.findByText(/Alla fälten måste vara ifyllda/i)
      ).toBeInTheDocument();
    });

    test("error when number of shoes doesn't match players", async () => {
      render(<Booking />, { wrapper: BrowserRouter });

      fireEvent.change(screen.getByLabelText(/date/i), {
        target: { value: "2024-12-19" },
      });
      fireEvent.change(screen.getByLabelText(/time/i), {
        target: { value: "16:00" },
      });
      fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
        target: { value: "2" },
      });
      fireEvent.change(screen.getByLabelText(/number of lanes/i), {
        target: { value: "1" },
      });

      fireEvent.click(screen.getByRole("button", { name: "+" }));

      const shoeInput = screen.getByLabelText(/shoe size/i);
      fireEvent.change(shoeInput, { target: { value: "44" } });
      fireEvent.click(screen.getByRole("button", { name: /strIIIIIike!/i }));

      expect(
        await screen.findByText(
          /Antalet skor måste stämma överens med antal spelare/i
        )
      ).toBeInTheDocument();
    });

    test("error when shoe sizes are not filled", async () => {
      render(<Booking />, { wrapper: BrowserRouter });

      // Fill required fields
      fireEvent.change(screen.getByLabelText(/date/i), {
        target: { value: "2024-12-19" },
      });
      fireEvent.change(screen.getByLabelText(/time/i), {
        target: { value: "16:00" },
      });
      fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
        target: { value: "2" },
      });
      fireEvent.change(screen.getByLabelText(/number of lanes/i), {
        target: { value: "1" },
      });

      fireEvent.click(screen.getByRole("button", { name: "+" }));
      fireEvent.click(screen.getByRole("button", { name: "+" }));

      fireEvent.click(screen.getByRole("button", { name: /strIIIIIike!/i }));

      expect(
        await screen.findByText(/Alla skor måste vara ifyllda/i)
      ).toBeInTheDocument();
    });

    test("shows error when players exceed lane capacity", async () => {
      render(<Booking />, { wrapper: BrowserRouter });

      fireEvent.change(screen.getByLabelText(/date/i), {
        target: { value: "2024-12-19" },
      });
      fireEvent.change(screen.getByLabelText(/time/i), {
        target: { value: "16:00" },
      });
      fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
        target: { value: "5" },
      });
      fireEvent.change(screen.getByLabelText(/number of lanes/i), {
        target: { value: "1" },
      });

      for (let i = 0; i < 5; i++) {
        fireEvent.click(screen.getByRole("button", { name: "+" }));
      }
      const shoeInputs = screen.getAllByLabelText(/shoe size/i);
      shoeInputs.forEach((input) => {
        fireEvent.change(input, { target: { value: "44" } });
      });

      fireEvent.click(screen.getByRole("button", { name: /strIIIIIike!/i }));

      expect(
        await screen.findByText(/Det får max vara 4 spelare per bana/i)
      ).toBeInTheDocument();
    });
  });
});
