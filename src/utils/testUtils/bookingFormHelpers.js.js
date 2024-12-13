import { fireEvent, screen } from "@testing-library/react";
import { createBookingData } from "./bookingData";

export const setupBooking = (data = {}) => {
  const bookingData = createBookingData(data);

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: bookingData.date },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: bookingData.time },
    });
    fireEvent.change(screen.getByLabelText(/number of awesome bowlers/i), {
      target: { value: bookingData.people },
    });
    fireEvent.change(screen.getByLabelText(/number of lanes/i), {
      target: { value: bookingData.lanes },
    });
  };

  const addShoes = (count) => {
    for (let i = 0; i < count; i++) {
      fireEvent.click(screen.getByRole("button", { name: "+" }));
    }

    const shoeInputs = screen.getAllByLabelText(/shoe size/i);
    shoeInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: bookingData.shoes[index] } });
    });
    return shoeInputs;
  };

  return {
    fillForm,
    addShoes,
    bookingData,
  };
};

export const submitBooking = () => {
  fireEvent.click(screen.getByRole("button", { name: /strIIIIIike!/i }));
};
