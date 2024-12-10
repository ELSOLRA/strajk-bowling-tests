import { http, HttpResponse } from "msw";

export const handlers = [
  http.post(
    "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com",
    async ({ request }) => {
      const apiKey = request.headers.get("x-api-key");
      if (apiKey !== "738c6b9d-24cf-47c3-b688-f4f4c5747662") {
        return new HttpResponse(null, { status: 401 });
      }

      const bookingInfo = await request.json();

      const pricePerPerson = 120;
      const pricePerLane = 100;

      const totalPrice =
        parseInt(bookingInfo.people) * pricePerPerson +
        parseInt(bookingInfo.lanes) * pricePerLane;

      return HttpResponse.json({
        ...bookingInfo,
        price: totalPrice,
        id: "1",
        active: true,
      });
    }
  ),
];
