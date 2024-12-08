import { http, HttpResponse } from "msw";

export const handlers = [
  http.post(
    "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com",
    async ({ request }) => {
      const booking = await request.json();

      return HttpResponse.json(
        { booking: booking },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  ),
];
