import { waitFor } from "@testing-library/react";
import { expect } from "vitest";

export const verifyBookingSubmission = async (expectedData) => {
  await waitFor(() => {
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      "confirmation",
      JSON.stringify(expectedData)
    );
    expect(mockNavigate).toHaveBeenCalledWith("/confirmation", {
      state: {
        confirmationDetails: expectedData,
      },
    });
  });
};
