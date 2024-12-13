export const createBookingData = ({
  date = "2024-12-19",
  time = "16:00",
  people = "2",
  lanes = "1",
  shoes = ["44", "44"],
} = {}) => {
  return {
    date,
    time,
    people,
    lanes,
    shoes,
  };
};

export const createExpectedData = ({
  when = "2024-12-19T16:00",
  lanes = "1",
  people = "2",
  shoes = ["44", "44"],
  id = "1",
} = {}) => {
  const pricePerPerson = 120;
  const pricePerLane = 100;
  const totalPrice =
    parseInt(people) * pricePerPerson + parseInt(lanes) * pricePerLane;

  return {
    when,
    lanes,
    people,
    shoes,
    price: totalPrice,
    id,
  };
};
