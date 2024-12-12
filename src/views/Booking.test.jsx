import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Booking from "./Booking";
import {
  setupBooking,
  submitBooking,
} from "../utils/testUtils/bookingFormHelpers.js";
import { createExpectedData } from "../utils/testUtils/bookingData.js";
import { verifyBookingSubmission } from "../utils/testUtils/bookingVerifiers.js";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Booking View", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.sessionStorage = {
      setItem: vi.fn(),
    };
    render(<Booking />, { wrapper: BrowserRouter });
  });

  // --- Successful booking flow ---
  describe("Successful booking", () => {
    test("Submits booking with correct data and saves to storage", async () => {
      const booking = setupBooking({});
      booking.fillForm();
      booking.addShoes(2);
      submitBooking();

      const expectedBookingData = createExpectedData({});

      /*       await waitFor(() => {
        expect(sessionStorage.setItem).toHaveBeenCalledWith(
          "confirmation",
          JSON.stringify(expectedBookingData)
        );

        expect(mockNavigate).toBeCalledWith("/confirmation", {
          state: {
            confirmationDetails: expectedBookingData,
          },
        });
      }); */
      verifyBookingSubmission(expectedBookingData);
    });
    test("completes booking after removing extra shoe field and using different shoe sizes", async () => {
      const booking = setupBooking({ shoes: ["44", "42", "41"] });
      booking.fillForm();
      booking.addShoes(3);

      const removeButtons = screen.getAllByRole("button", { name: "-" });
      fireEvent.click(removeButtons[2]);

      submitBooking();

      const expectedBookingData = createExpectedData({ shoes: ["44", "42"] });

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
      submitBooking();

      expect(
        await screen.findByText(/Alla fälten måste vara ifyllda/i)
      ).toBeInTheDocument();
    });

    test("error when number of shoes doesn't match players", async () => {
      const booking = setupBooking({});
      booking.fillForm();
      booking.addShoes(1);
      submitBooking();

      expect(
        await screen.findByText(
          /Antalet skor måste stämma överens med antal spelare/i
        )
      ).toBeInTheDocument();
    });

    test("error when shoe sizes are not filled", async () => {
      const booking = setupBooking({ shoes: [] });
      booking.fillForm();
      booking.addShoes(2);
      submitBooking();
      expect(
        await screen.findByText(/Alla skor måste vara ifyllda/i)
      ).toBeInTheDocument();
    });

    test("shows error when players exceed lane capacity", async () => {
      const shoes = Array(5).fill("44");

      const booking = setupBooking({ people: "5", shoes: shoes });
      booking.fillForm();
      booking.addShoes(5);
      submitBooking();
      screen.debug();

      expect(
        await screen.findByText(/Det får max vara 4 spelare per bana/i)
      ).toBeInTheDocument();
    });
  });
});
