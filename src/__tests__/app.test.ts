import request from "supertest";
import db from "../db/connection";
import app from "../app";
import seed from "../db/seeds/seed";
import checklistData from "../db/data/test-data/checklist";
import usersData from "../db/data/test-data/users";
import tripsData from "../db/data/test-data/trips";
import costsData from "../db/data/test-data/dailycost";
import endpointsJson from "../../endpoints.json";
import {
  Trips,
  Users,
  Checklist,
  UsersTest,
  TripsTest,
  ChecklistTest,
} from "../types/types";
import { Response } from "supertest";

afterAll(() => {
  console.log("All test finished");
  return db.end();
});

let users = [];
let trips = [];
let checklists = [];

let user1: UsersTest, user2: UsersTest, user3: UsersTest;
let trip1: TripsTest, trip2: TripsTest, trip3: TripsTest;
let checklist1: ChecklistTest,
  checklist2: ChecklistTest,
  checklist3: ChecklistTest;

beforeEach(async () => {
  await seed({ usersData, tripsData, checklistData, costsData });
  const userResponse = await db.query("SELECT user_id, username FROM users");
  users = userResponse.rows;

  [user1, user2, user3] = users.map((user, index) => ({
    username: user.username,
    user_id: user.user_id,
  }));

  const tripsResponse = await db.query("SELECT user_id, trip_id FROM trips");
  trips = tripsResponse.rows;

  [trip1, trip2, trip3] = trips.map((trip) => ({
    user_id: trip.user_id,
    trip_id: trip.trip_id,
  }));

  const checklistResponse = await db.query(
    "SELECT user_id, trip_id, checklist_id FROM checklist"
  );
  checklists = checklistResponse.rows;

  [checklist1, checklist2, checklist3] = checklists.map((checklist) => ({
    user_id: checklist.user_id,
    trip_id: checklist.trip_id,
    checklist_id: checklist.checklist_id,
  }));
});

describe("GET /api", () => {
  test("200: Responds with all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(5);
        users.forEach((user: Users) => {
          expect(user).toEqual(
            expect.objectContaining({
              user_id: expect.any(String),
              username: expect.any(String),
              name: expect.any(String),
            })
          );
        });
      });
  });
  test("404: Responds with an error message when the route is not correct", () => {
    return request(app)
      .get("/api/usersllalalala")
      .expect(404)
      .then((response: any) => {
        expect(response.res.statusMessage).toBe("Not Found");
      });
  });
});

describe("GET /api/users/:user_id", () => {
  test("200: Responds with single user ", () => {
    return request(app)
      .get(`/api/users/${user1.user_id}`)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual(
          expect.objectContaining({
            user_id: expect.any(String),
            username: expect.any(String),
            name: expect.any(String),
          })
        );
      });
  });

  test("404: Responds with msg when the user does not exist ", () => {
    return request(app)
      .get("/api/users/10")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/user/:user_id", () => {
  test("204: Should delete selected user ", () => {
    return request(app).delete(`/api/users/${user1.user_id}`).expect(204);
  });
  test("404: Responds with msg when the user does not exist ", () => {
    return request(app)
      .delete("/api/users/9f55df0f-6350-4b1d-a271-297d490857d0")
      .expect(404)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Does Not Found");
      });
  });
  test("400: Responds with msg when the user_id is not a number ", () => {
    return request(app)
      .delete("/api/users/asd")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("POST api/users", () => {
  test("201: Should post a new user", () => {
    const userData: Users = {
      username: "alexonur",
      name: "Alex Onur",
    };

    return request(app)
      .post("/api/users")
      .send(userData)
      .expect(201)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          user_id: expect.any(String),
          username: "alexonur",
          name: "Alex Onur",
        });
      });
  });
  test("201: Should post a new user", () => {
    const userData: Users = {
      user_id: "e9b0f6e4-5f29-4e18-ae4d-3372e8ed6946",
      username: "alexonur",
      name: "Alex Onur",
    };

    return request(app)
      .post("/api/users")
      .send(userData)
      .expect(201)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          user_id: "e9b0f6e4-5f29-4e18-ae4d-3372e8ed6946",
          username: "alexonur",
          name: "Alex Onur",
        });
      });
  });
  test("400: Responds with bad request when post body has more properties than allowed", () => {
    const userData: Users = {
      user_id: "9",
      username: "alexonur444",
      name: "Alex Onur",
    };

    return request(app)
      .post("/api/users")
      .send(userData)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Responds with bad request when passed number in name", () => {
    const userData: Users = {
      username: "alexonur",
      name: "Alex Onur123",
    };

    return request(app)
      .post("/api/users")
      .send(userData)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH api/users/:user_id", () => {
  test("200: Responds with an updated user object ", () => {
    const userData: Users = {
      username: "alexonur",
      name: "Alex Onur",
    };

    return request(app)
      .patch(`/api/users/${user1.user_id}`)
      .send(userData)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          user_id: expect.any(String),
          username: "alexonur",
          name: "Alex Onur",
        });
      });
  });
  test("200: Responds with an updated username when passed only username ", () => {
    const userData: any = {
      username: "alexonur",
    };

    return request(app)
      .patch(`/api/users/${user1.user_id}`)
      .send(userData)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          user_id: expect.any(String),
          username: "alexonur",
          name: "alex",
        });
      });
  });
  test("200: Responds with an updated username when passed only name ", () => {
    const userData: any = {
      name: "onur",
    };

    return request(app)
      .patch(`/api/users/${user1.user_id}`)
      .send(userData)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          user_id: expect.any(String),
          username: "alex123",
          name: "onur",
        });
      });
  });
  test("400: Responds with bad request when passed number in name", () => {
    const userData: Users = {
      username: "alexonur",
      name: "Alex Onur123",
    };

    return request(app)
      .patch("/api/users/1")
      .send(userData)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Responds with bad request when user try to change user_id", () => {
    const userData: Users = {
      user_id: "9",
      username: "alexonur",
      name: "Alex Onur123",
    };

    return request(app)
      .patch("/api/users/1")
      .send(userData)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("404: Responds with not found request when user does not exist", () => {
    const userData: Users = {
      username: "alexonur",
      name: "Alex Onur",
    };

    return request(app)
      .patch("/api/users/9f55df0f-6350-4b1d-a271-297d490857d0")
      .send(userData)
      .expect(404)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Does Not Found");
      });
  });
});

describe("GET /api/dailyCost/:country", () => {
  test("200: Responds with correct daily cost based on input destination", () => {
    return request(app)
      .get("/api/dailyCost/UK")
      .expect(200)
      .then(({ body: { countryInfo } }) => {
        expect(countryInfo).toEqual({
          country: "UK",
          daily_cost_in_dollars: 2000,
        });
      });
  });
  test("404: Responds with not found when country does not exist", () => {
    return request(app)
      .get("/api/dailyCost/unknowncountry")
      .expect(404)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Does Not Found");
      });
  });
});

describe("GET /api/trips/:user_id", () => {
  test.only("200: Responds with all trips for user ", () => {
    return request(app)
      .get(`/api/trips/${user1.user_id}`)
      .expect(200)
      .then(({ body: { trips } }: { body: { trips: Trips[] } }) => {
        expect(trips).toHaveLength(1);
        trips.forEach((trip: Trips) => {
          console.log(trip)
          expect(trip).toEqual(
            expect.objectContaining({
              trip_id: expect.any(String),
              user_id: expect.any(String),
              destination: expect.objectContaining({
                city: expect.any(String),
                country: expect.any(String),
                currency: expect.any(String),
              }),
              start_date: expect.any(String),
              end_date: expect.any(String),
              passport_issued_country: expect.any(String),
              weather: expect.objectContaining({
                temp: expect.any(Number),
                weather_type: expect.any(String),
              }),
              visa_type: expect.any(String),
              budget: expect.objectContaining({
                current_amount: expect.any(Number),
                current_currency: expect.any(String),
                destination_currency: expect.any(String),
                destination_amount: expect.any(Number),
              }),
              is_booked_hotel: expect.any(Boolean),
              people_count: expect.any(Number),
              city_information: expect.any(String),
              landmarks: expect.arrayContaining([
                expect.objectContaining({
                  name: expect.any(String),
                  description: expect.any(String),
                  img_url: expect.any(String),
                }),
              ]),
              events: expect.arrayContaining([
                expect.objectContaining({
                  venue: expect.any(String),
                  date: expect.any(String),
                  name: expect.any(String),
                  event_url: expect.any(String),
                  img_url: expect.any(String),
                }),
              ]),
              daily_expected_cost: expect.any(Number),
            })
          );
        });
      });
  });

  test("404: Should responds with an error message when user does not exist", () => {
    return request(app)
      .get("/api/trips/9f55df0f-6350-4b1d-a271-297d490857d0")
      .expect(404)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Does Not Found");
      });
  });
});

describe("POST /api/trips/:user_id", () => {
  test("201: Should post a new trip for user ", () => {
    const tripData = {
      destination: {
        city: "Amsterdam",
        country: "NL",
        currency: "EUR",
      },
      start_date: "2025-03-20",
      end_date: "2025-03-25",
      passport_issued_country: "GB",
      visa_type: "eVisa",
      budget: {
        current_amount: 3000,
        current_currency: "GBP",
        destination_currency: "EUR",
      },
      is_booked_hotel: false,
      people_count: 1,
      daily_expected_cost: 200,
    };
    return request(app)
      .post(`/api/trips/${user1.user_id}`)
      .send(tripData)
      .expect(201)
      .then(({ body: { trip } }: { body: { trip: Trips[] } }) => {
        expect(trip).toEqual(
          expect.objectContaining({
            trip_id: expect.any(String),
            user_id: expect.any(String),
            destination: expect.objectContaining({
              city: expect.any(String),
              country: expect.any(String),
              currency: expect.any(String),
            }),
            start_date: expect.any(String),
            end_date: expect.any(String),
            passport_issued_country: expect.any(String),
            weather: expect.objectContaining({
              temp: expect.any(Number),
              weather_type: expect.any(String),
            }),
            visa_type: expect.any(String),
            budget: expect.objectContaining({
              current_amount: expect.any(Number),
              current_currency: expect.any(String),
              destination_currency: expect.any(String),
              destination_amount: expect.any(Number),
            }),
            is_booked_hotel: expect.any(Boolean),
            people_count: expect.any(Number),
            city_information: expect.any(String),
            landmarks: expect.arrayContaining([
              expect.objectContaining({
                name: expect.any(String),
                description: expect.any(String),
                img_url: expect.any(String),
              }),
            ]),
            events: expect.arrayContaining([
              expect.objectContaining({
                venue: expect.any(String),
                date: expect.any(String),
                name: expect.any(String),
                event_url: expect.any(String),
                img_url: expect.any(String),
              }),
            ]),
            daily_expected_cost: expect.any(Number),
          })
        );
      });
  });
  test("404: Responds with error message when user does not exist", () => {
    const tripData = {
      destination: {
        city: "Amsterdam",
        country: "NE",
        currency: "EUR",
      },
      start_date: "25/01/2025",
      end_date: "15/02/2025",
      passport_issued_country: "UK",
      weather: {
        temp: 25,
        weather_type: "Cloudly",
      },
      visa_type: "eVisa",
      budget: {
        amount: 1000,
        currency: "EUR",
      },
      is_booked_hotel: false,
      people_count: 1,
      city_information: "Capital of Netherlands",
      landmarks: {
        best_places_to_visit: ["Tower", "City Center", "Museum"],
        img_url_of_landmarks: ["", "", ""],
      },
      events: [
        {
          name: "eminem concert",
          venue: "empty venue",
          date: "15/01/2025",
          img: "",
          price: 1000,
        },
      ],
      daily_expected_cost: 200,
    };
    return request(app)
      .post("/api/trips/9f55df0f-6350-4b1d-a271-297d490857d0")
      .send(tripData)
      .expect(404)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Does Not Found");
      });
  });
});

describe("PATCH /api/trips/:user_id/:trip_id", () => {
  test("200: Responds with updated trip data", () => {
    const tripData = {
      start_date: "10/02/2025",
      end_date: "05/03/2025",
      budget: {
        amount: 1500,
        currency: "GBP",
      },
      is_booked_hotel: true,
      people_count: 3,
    };

    return request(app)
      .patch(`/api/trips/${user1.user_id}/${trip1.trip_id}`)
      .send(tripData)
      .expect(200)
      .then(({ body: { trip } }: { body: { trip: Trips } }) => {
        expect(trip.start_date).toBe("10/02/2025");
        expect(trip.end_date).toBe("05/03/2025");
        expect(trip.budget).toEqual({
          amount: 1500,
          currency: "GBP",
        });
        expect(trip.is_booked_hotel).toBe(true);
        expect(trip.people_count).toBe(3);
      });
  });
  test("200: Responds with updated trip data with one value changed", () => {
    const tripData = {
      people_count: 3,
    };

    return request(app)
      .patch(`/api/trips/${user1.user_id}/${trip1.trip_id}`)
      .send(tripData)
      .expect(200)
      .then(({ body: { trip } }: { body: { trip: Trips } }) => {
        expect(trip.people_count).toBe(3);
      });
  });
  test("200: Responds with updated trip data with two values changed", () => {
    const tripData = {
      people_count: 3,
      budget: {
        amount: 3000,
        currency: "TRY",
      },
    };

    return request(app)
      .patch(`/api/trips/${user1.user_id}/${trip1.trip_id}`)
      .send(tripData)
      .expect(200)
      .then(({ body: { trip } }: { body: { trip: Trips } }) => {
        expect(trip.people_count).toBe(3);
        expect(trip.budget).toEqual({
          amount: 3000,
          currency: "TRY",
        });
      });
  });
  test("400: Responds with an error when given incorrect user_id", () => {
    const tripData = {
      people_count: 3,
      budget: {
        amount: 3000,
        currency: "TRY",
      },
    };

    return request(app)
      .patch("/api/trips/9f55df0f-6350-4b1d-a271-297d490857d0/1")
      .send(tripData)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Responds with an error when given incorrect trip_id", () => {
    const tripData = {
      people_count: 3,
      budget: {
        amount: 3000,
        currency: "TRY",
      },
    };

    return request(app)
      .patch("/api/trips/1/9f55df0f-6350-4b1d-a271-297d490857d0")
      .send(tripData)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Responds with an error when trying to change incorrect column", () => {
    const tripData = {
      destination: {
        city: "London",
        country: "UK",
        currency: "GBP",
      },
    };

    return request(app)
      .patch(`/api/trips/${user1.user_id}/${trip1.trip_id}`)
      .send(tripData)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Responds with an error when trying to change incorrect column", () => {
    const tripData = {
      destination: {
        city: "London",
        country: "UK",
        currency: "GBP",
      },
      people_count: 3,
    };

    return request(app)
      .patch(`/api/trips/${user1.user_id}/${trip1.trip_id}`)
      .send(tripData)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/trips/:user_id/:trip_id", () => {
  test("200: Responds with a single trip for specified user", () => {
    return request(app)
      .get(`/api/trips/${user1.user_id}/${trip1.trip_id}`)
      .expect(200)
      .then(({ body: { trip } }: { body: { trip: Trips } }) => {
        expect(trip).toEqual(
          expect.objectContaining({
            trip_id: expect.any(String),
            user_id: expect.any(String),
            destination: expect.objectContaining({
              city: expect.any(String),
              country: expect.any(String),
              currency: expect.any(String),
            }),
            start_date: expect.any(String),
            end_date: expect.any(String),
            passport_issued_country: expect.any(String),
            weather: expect.objectContaining({
              temp: expect.any(Number),
              weather_type: expect.any(String),
            }),
            visa_type: expect.any(String),
            budget: expect.objectContaining({
              current_amount: expect.any(Number),
              current_currency: expect.any(String),
              destination_currency: expect.any(String),
              destination_amount: expect.any(Number),
            }),
            is_booked_hotel: expect.any(Boolean),
            people_count: expect.any(Number),
            city_information: expect.any(String),
            landmarks: expect.arrayContaining([
              expect.objectContaining({
                name: expect.any(String),
                description: expect.any(String),
                img_url: expect.any(String),
              }),
            ]),
            events: expect.arrayContaining([
              expect.objectContaining({
                venue: expect.any(String),
                date: expect.any(String),
                name: expect.any(String),
                event_url: expect.any(String),
                img_url: expect.any(String),
              }),
            ]),
            daily_expected_cost: expect.any(Number),
          })
        );
      });
  });
});

describe("DELETE /api/trips/:user_id/:trip_id", () => {
  test("204: Should delete selected trip ", () => {
    return request(app)
      .delete(`/api/trips/${user1.user_id}/${trip1.trip_id}`)
      .expect(204);
  });
  test("400: Responds with msg when the trip does not exist ", () => {
    return request(app)
      .delete("/api/trips/1/9f55df0f-6350-4b1d-a271-297d490857d0")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Responds with msg when the trip_id is not a number ", () => {
    return request(app)
      .delete("/api/trips/1/9f55df0f-6350-4b1d-a271-297d490857d0")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/checklists/:user_id/:trip_id", () => {
  test("200: Returns a single checklist based on the trip_id", () => {
    return request(app)
      .get(`/api/checklists/${user1.user_id}/${trip1.trip_id}`)
      .expect(200)
      .then(({ body: { checklist } }: { body: { checklist: Checklist } }) => {
        expect(checklist).toEqual(
          expect.objectContaining({
            checklist_id: expect.any(String),
            trip_id: expect.any(String),
            user_id: expect.any(String),
            items: expect.arrayContaining([
              expect.objectContaining({
                item: expect.any(String),
                completed: expect.any(Boolean),
              }),
            ]),
          })
        );
      });
  });
  test("400: Returns an error when passed incorrect/not exist user id", () => {
    return request(app)
      .get(`/api/checklists/9f55df0f-6350-4b1d-a271-297d490857d0/1`)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Returns an error when passed incorrect/not exist trip id", () => {
    return request(app)
      .get("/api/checklists/1/9f55df0f-6350-4b1d-a271-297d490857d0")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Returns an error when passed string as trip_id", () => {
    return request(app)
      .get("/api/checklists/1/abc")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Returns an error when passed string as user_id", () => {
    return request(app)
      .get("/api/checklists/abc/1")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/checklists/:user_id/:trip_id", () => {
  test("201: Posts checklist to the checklist table ", () => {
    return request(app)
      .post(`/api/checklists/${user1.user_id}/${trip1.trip_id}`)
      .expect(201)
      .then(({ body: { checklist } }: { body: { checklist: Checklist } }) => {
        expect(checklist).toEqual(
          expect.objectContaining({
            checklist_id: expect.any(String),
            trip_id: expect.any(String),
            user_id: expect.any(String),
            items: expect.arrayContaining([
              expect.objectContaining({
                item: expect.any(String),
                completed: expect.any(Boolean),
              }),
            ]),
          })
        );
      });
  });
  test("400: Returns an error when passed incorrect/not exist user id", () => {
    return request(app)
      .post("/api/checklists/10/1")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Returns an error when passed incorrect/not exist trip id", () => {
    return request(app)
      .post("/api/checklists/1/10")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  test("400: Returns an error when passed user_id as a string", () => {
    return request(app)
      .post("/api/checklists/abc/1")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Returns an error when passed trip_id as a string", () => {
    return request(app)
      .post("/api/checklists/1/abc")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/checklists/:user_id/:trip_id/", () => {
  test("200: Should patch checklist items ", () => {
    const inputChecklistItem = { newItem: "new item" };
    return request(app)
      .patch(`/api/checklists/${user1.user_id}/${trip1.trip_id}`)
      .send(inputChecklistItem)
      .expect(200)
      .then(({ body: { checklist } }: { body: { checklist: Checklist } }) => {
        expect(checklist).toEqual({
          checklist_id: expect.any(String),
          trip_id: expect.any(String),
          user_id: expect.any(String),
          items: [
            {item:"Check your passport", completed:false},
            {item:"Print or download your tickets (flight/train/bus).", completed:false},
            {item:"Pack comfortable T-shirts/tops.", completed:false},
            {item:"Dont forget your pants/shorts/skirts.", completed:false},
            {item:"Pack comfortable shoes for walking.", completed:false},
            {item:"Pack your toothbrush and toothpaste.", completed:false},
            {item:"Bring your phone charger.", completed:false},
            {item:"Pack a power bank for emergencies.", completed:false},
            {item:"new item", completed:false},
          ],
        });
      });
  });
  test("400: Should return an error msg if user id does not exist ", () => {
    const inputChecklistItem = { newItem: "new item" };
    return request(app)
      .patch("/api/checklists/10/1")
      .send(inputChecklistItem)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Should return an error msg if trip id does not exist ", () => {
    const inputChecklistItem = { newItem: "new item" };
    return request(app)
      .patch("/api/checklists/1/10")
      .send(inputChecklistItem)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Should return an error msg if user id is string ", () => {
    const inputChecklistItem = { newItem: "new item" };
    return request(app)
      .patch("/api/checklists/abc/1")
      .send(inputChecklistItem)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Should return an error msg if trip id is string ", () => {
    const inputChecklistItem = { newItem: "new item" };
    return request(app)
      .patch("/api/checklists/1/abc")
      .send(inputChecklistItem)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/checklists/:user_id/:trip_id/delete-item (Deleting single item from items array)", () => {
  test("200: Should delete single item from items array ", () => {
    const deleteChecklistItem = { item: "Check your passport" };
    return request(app)
      .patch(`/api/checklists/${user1.user_id}/${trip1.trip_id}/delete-item`)
      .send(deleteChecklistItem)
      .expect(200)
      .then(({ body: { checklist } }: { body: { checklist: Checklist } }) => {
        expect(checklist).toEqual({
          checklist_id: expect.any(String),
          trip_id: expect.any(String),
          user_id: expect.any(String),
          items: [  
            {item:"Print or download your tickets (flight/train/bus).", completed:false},
            {item:"Pack comfortable T-shirts/tops.", completed:false},
            {item:"Dont forget your pants/shorts/skirts.", completed:false},
            {item:"Pack comfortable shoes for walking.", completed:false},
            {item:"Pack your toothbrush and toothpaste.", completed:false},
            {item:"Bring your phone charger.", completed:false},
            {item:"Pack a power bank for emergencies.", completed:false},
          ],
        });
      });
  });
  test("400: Should return an error msg if user id does not exist ", () => {
    const deleteChecklistItem = { item: "Check your passport" };
    return request(app)
      .patch("/api/checklists/10/1")
      .send(deleteChecklistItem)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Should return an error msg if trip id does not exist ", () => {
    const deleteChecklistItem = { item: "Check your passport" };
    return request(app)
      .patch("/api/checklists/1/10")
      .send(deleteChecklistItem)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Should return an error msg if user id is string ", () => {
    const deleteChecklistItem = { item: "Check your passport" };
    return request(app)
      .patch("/api/checklists/abc/1")
      .send(deleteChecklistItem)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Should return an error msg if trip id is string ", () => {
    const deleteChecklistItem = { item: "Check your passport" };
    return request(app)
      .patch("/api/checklists/1/abc")
      .send(deleteChecklistItem)
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/checklists/:user_id/:trip_id", () => {
  test("204: Should delete entire checklist  ", () => {
    return request(app)
      .delete(`/api/checklists/${user1.user_id}/${trip1.trip_id}`)
      .expect(204);
  });
  test("400: Should return an error msg if user id does not exist ", () => {
    return request(app)
      .delete("/api/checklists/10/1")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("404: Should return an error msg if trip id does not exist ", () => {
    return request(app)
      .delete("/api/checklists/1/10")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Should return an error msg if user id is string ", () => {
    return request(app)
      .delete("/api/checklists/abc/1")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Should return an error msg if trip id is string ", () => {
    return request(app)
      .delete("/api/checklists/1/abc")
      .expect(400)
      .then((response: Response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});
