"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const connection_1 = __importDefault(require("../db/connection"));
const app_1 = __importDefault(require("../app"));
const seed_1 = __importDefault(require("../db/seeds/seed"));
const checklist_1 = __importDefault(require("../db/data/test-data/checklist"));
const users_1 = __importDefault(require("../db/data/test-data/users"));
const trips_1 = __importDefault(require("../db/data/test-data/trips"));
const dailycost_1 = __importDefault(require("../db/data/test-data/dailycost"));
const endpoints_json_1 = __importDefault(require("../../endpoints.json"));
afterAll(() => {
    console.log("All test finished");
    return connection_1.default.end();
});
let users = [];
let trips = [];
let checklists = [];
let user1, user2, user3;
let trip1, trip2, trip3;
let checklist1, checklist2, checklist3;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, seed_1.default)({ usersData: users_1.default, tripsData: trips_1.default, checklistData: checklist_1.default, costsData: dailycost_1.default });
    const userResponse = yield connection_1.default.query("SELECT user_id, username FROM users");
    users = userResponse.rows;
    [user1, user2, user3] = users.map((user, index) => ({
        username: user.username,
        user_id: user.user_id,
    }));
    const tripsResponse = yield connection_1.default.query("SELECT user_id, trip_id FROM trips");
    trips = tripsResponse.rows;
    [trip1, trip2, trip3] = trips.map((trip) => ({
        user_id: trip.user_id,
        trip_id: trip.trip_id,
    }));
    const checklistResponse = yield connection_1.default.query("SELECT user_id, trip_id, checklist_id FROM checklist");
    checklists = checklistResponse.rows;
    [checklist1, checklist2, checklist3] = checklists.map((checklist) => ({
        user_id: checklist.user_id,
        trip_id: checklist.trip_id,
        checklist_id: checklist.checklist_id,
    }));
}));
describe("GET /api", () => {
    test("200: Responds with all endpoints", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api")
            .expect(200)
            .then(({ body: { endpoints } }) => {
            expect(endpoints).toEqual(endpoints_json_1.default);
        });
    });
});
describe("GET /api/users", () => {
    test("200: Responds with all users", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/users")
            .expect(200)
            .then(({ body: { users } }) => {
            expect(users).toHaveLength(5);
            users.forEach((user) => {
                expect(user).toEqual(expect.objectContaining({
                    user_id: expect.any(String),
                    username: expect.any(String),
                    name: expect.any(String),
                }));
            });
        });
    });
    test("404: Responds with an error message when the route is not correct", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/usersllalalala")
            .expect(404)
            .then((response) => {
            expect(response.res.statusMessage).toBe("Not Found");
        });
    });
});
describe("GET /api/users/:user_id", () => {
    test("200: Responds with single user ", () => {
        return (0, supertest_1.default)(app_1.default)
            .get(`/api/users/${user1.user_id}`)
            .expect(200)
            .then(({ body: { user } }) => {
            expect(user).toEqual(expect.objectContaining({
                user_id: expect.any(String),
                username: expect.any(String),
                name: expect.any(String),
            }));
        });
    });
    test("404: Responds with msg when the user does not exist ", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/users/10")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
});
describe("DELETE /api/user/:user_id", () => {
    test("204: Should delete selected user ", () => {
        return (0, supertest_1.default)(app_1.default).delete(`/api/users/${user1.user_id}`).expect(204);
    });
    test("404: Responds with msg when the user does not exist ", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/users/9f55df0f-6350-4b1d-a271-297d490857d0")
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("Does Not Found");
        });
    });
    test("400: Responds with msg when the user_id is not a number ", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/users/asd")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
});
describe("POST api/users", () => {
    test("201: Should post a new user", () => {
        const userData = {
            username: "alexonur",
            name: "Alex Onur",
        };
        return (0, supertest_1.default)(app_1.default)
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
        const userData = {
            user_id: "e9b0f6e4-5f29-4e18-ae4d-3372e8ed6946",
            username: "alexonur",
            name: "Alex Onur",
        };
        return (0, supertest_1.default)(app_1.default)
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
        const userData = {
            user_id: "9",
            username: "alexonur444",
            name: "Alex Onur",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/users")
            .send(userData)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Responds with bad request when passed number in name", () => {
        const userData = {
            username: "alexonur",
            name: "Alex Onur123",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/users")
            .send(userData)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
});
describe("PATCH api/users/:user_id", () => {
    test("200: Responds with an updated user object ", () => {
        const userData = {
            username: "alexonur",
            name: "Alex Onur",
        };
        return (0, supertest_1.default)(app_1.default)
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
        const userData = {
            username: "alexonur",
        };
        return (0, supertest_1.default)(app_1.default)
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
        const userData = {
            name: "onur",
        };
        return (0, supertest_1.default)(app_1.default)
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
        const userData = {
            username: "alexonur",
            name: "Alex Onur123",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/users/1")
            .send(userData)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Responds with bad request when user try to change user_id", () => {
        const userData = {
            user_id: "9",
            username: "alexonur",
            name: "Alex Onur123",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/users/1")
            .send(userData)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("404: Responds with not found request when user does not exist", () => {
        const userData = {
            username: "alexonur",
            name: "Alex Onur",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/users/9f55df0f-6350-4b1d-a271-297d490857d0")
            .send(userData)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("Does Not Found");
        });
    });
});
describe("GET /api/dailyCost/:country", () => {
    test("200: Responds with correct daily cost based on input destination", () => {
        return (0, supertest_1.default)(app_1.default)
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
        return (0, supertest_1.default)(app_1.default)
            .get("/api/dailyCost/unknowncountry")
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("Does Not Found");
        });
    });
});
describe("GET /api/trips/:user_id", () => {
    test("200: Responds with all trips for user ", () => {
        return (0, supertest_1.default)(app_1.default)
            .get(`/api/trips/${user1.user_id}`)
            .expect(200)
            .then(({ body: { trips } }) => {
            expect(trips).toHaveLength(1);
            trips.forEach((trip) => {
                expect(trip).toEqual(expect.objectContaining({
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
                }));
            });
        });
    });
    test("404: Should responds with an error message when user does not exist", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/trips/9f55df0f-6350-4b1d-a271-297d490857d0")
            .expect(404)
            .then((response) => {
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
        return (0, supertest_1.default)(app_1.default)
            .post(`/api/trips/${user1.user_id}`)
            .send(tripData)
            .expect(201)
            .then(({ body: { trip } }) => {
            expect(trip).toEqual(expect.objectContaining({
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
            }));
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
        return (0, supertest_1.default)(app_1.default)
            .post("/api/trips/9f55df0f-6350-4b1d-a271-297d490857d0")
            .send(tripData)
            .expect(404)
            .then((response) => {
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
        return (0, supertest_1.default)(app_1.default)
            .patch(`/api/trips/${user1.user_id}/${trip1.trip_id}`)
            .send(tripData)
            .expect(200)
            .then(({ body: { trip } }) => {
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
        return (0, supertest_1.default)(app_1.default)
            .patch(`/api/trips/${user1.user_id}/${trip1.trip_id}`)
            .send(tripData)
            .expect(200)
            .then(({ body: { trip } }) => {
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
        return (0, supertest_1.default)(app_1.default)
            .patch(`/api/trips/${user1.user_id}/${trip1.trip_id}`)
            .send(tripData)
            .expect(200)
            .then(({ body: { trip } }) => {
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
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/trips/9f55df0f-6350-4b1d-a271-297d490857d0/1")
            .send(tripData)
            .expect(400)
            .then((response) => {
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
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/trips/1/9f55df0f-6350-4b1d-a271-297d490857d0")
            .send(tripData)
            .expect(400)
            .then((response) => {
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
        return (0, supertest_1.default)(app_1.default)
            .patch(`/api/trips/${user1.user_id}/${trip1.trip_id}`)
            .send(tripData)
            .expect(400)
            .then((response) => {
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
        return (0, supertest_1.default)(app_1.default)
            .patch(`/api/trips/${user1.user_id}/${trip1.trip_id}`)
            .send(tripData)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
});
describe("GET /api/trips/:user_id/:trip_id", () => {
    test("200: Responds with a single trip for specified user", () => {
        return (0, supertest_1.default)(app_1.default)
            .get(`/api/trips/${user1.user_id}/${trip1.trip_id}`)
            .expect(200)
            .then(({ body: { trip } }) => {
            expect(trip).toEqual(expect.objectContaining({
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
            }));
        });
    });
});
describe("DELETE /api/trips/:user_id/:trip_id", () => {
    test("204: Should delete selected trip ", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete(`/api/trips/${user1.user_id}/${trip1.trip_id}`)
            .expect(204);
    });
    test("400: Responds with msg when the trip does not exist ", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/trips/1/9f55df0f-6350-4b1d-a271-297d490857d0")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Responds with msg when the trip_id is not a number ", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/trips/1/9f55df0f-6350-4b1d-a271-297d490857d0")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
});
describe("GET /api/checklists/:user_id/:trip_id", () => {
    test("200: Returns a single checklist based on the trip_id", () => {
        return (0, supertest_1.default)(app_1.default)
            .get(`/api/checklists/${user1.user_id}/${trip1.trip_id}`)
            .expect(200)
            .then(({ body: { checklist } }) => {
            expect(checklist).toEqual(expect.objectContaining({
                checklist_id: expect.any(String),
                trip_id: expect.any(String),
                user_id: expect.any(String),
                items: expect.arrayContaining([
                    expect.objectContaining({
                        item: expect.any(String),
                        completed: expect.any(Boolean),
                    }),
                ]),
            }));
        });
    });
    test("400: Returns an error when passed incorrect/not exist user id", () => {
        return (0, supertest_1.default)(app_1.default)
            .get(`/api/checklists/9f55df0f-6350-4b1d-a271-297d490857d0/1`)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Returns an error when passed incorrect/not exist trip id", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/checklists/1/9f55df0f-6350-4b1d-a271-297d490857d0")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Returns an error when passed string as trip_id", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/checklists/1/abc")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Returns an error when passed string as user_id", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/checklists/abc/1")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
});
describe("POST /api/checklists/:user_id/:trip_id", () => {
    test("201: Posts checklist to the checklist table ", () => {
        return (0, supertest_1.default)(app_1.default)
            .post(`/api/checklists/${user1.user_id}/${trip1.trip_id}`)
            .expect(201)
            .then(({ body: { checklist } }) => {
            expect(checklist).toEqual(expect.objectContaining({
                checklist_id: expect.any(String),
                trip_id: expect.any(String),
                user_id: expect.any(String),
                items: expect.arrayContaining([
                    expect.objectContaining({
                        item: expect.any(String),
                        completed: expect.any(Boolean),
                    }),
                ]),
            }));
        });
    });
    test("400: Returns an error when passed incorrect/not exist user id", () => {
        return (0, supertest_1.default)(app_1.default)
            .post("/api/checklists/10/1")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Returns an error when passed incorrect/not exist trip id", () => {
        return (0, supertest_1.default)(app_1.default)
            .post("/api/checklists/1/10")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Returns an error when passed user_id as a string", () => {
        return (0, supertest_1.default)(app_1.default)
            .post("/api/checklists/abc/1")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Returns an error when passed trip_id as a string", () => {
        return (0, supertest_1.default)(app_1.default)
            .post("/api/checklists/1/abc")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
});
describe("PATCH /api/checklists/:user_id/:trip_id/", () => {
    test("200: Should patch checklist items ", () => {
        const inputChecklistItem = { newItem: "new item" };
        return (0, supertest_1.default)(app_1.default)
            .patch(`/api/checklists/${user1.user_id}/${trip1.trip_id}`)
            .send(inputChecklistItem)
            .expect(200)
            .then(({ body: { checklist } }) => {
            expect(checklist).toEqual({
                checklist_id: expect.any(String),
                trip_id: expect.any(String),
                user_id: expect.any(String),
                items: [
                    { item: "Check your passport", completed: false },
                    {
                        item: "Print or download your tickets (flight/train/bus).",
                        completed: false,
                    },
                    { item: "Pack comfortable T-shirts/tops.", completed: false },
                    { item: "Dont forget your pants/shorts/skirts.", completed: false },
                    { item: "Pack comfortable shoes for walking.", completed: false },
                    { item: "Pack your toothbrush and toothpaste.", completed: false },
                    { item: "Bring your phone charger.", completed: false },
                    { item: "Pack a power bank for emergencies.", completed: false },
                    { item: "new item", completed: false },
                ],
            });
        });
    });
    test("400: Should return an error msg if user id does not exist ", () => {
        const inputChecklistItem = { newItem: "new item" };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/checklists/10/1")
            .send(inputChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Should return an error msg if trip id does not exist ", () => {
        const inputChecklistItem = { newItem: "new item" };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/checklists/1/10")
            .send(inputChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Should return an error msg if user id is string ", () => {
        const inputChecklistItem = { newItem: "new item" };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/checklists/abc/1")
            .send(inputChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Should return an error msg if trip id is string ", () => {
        const inputChecklistItem = { newItem: "new item" };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/checklists/1/abc")
            .send(inputChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
});
describe("PATCH /api/checklists/:user_id/:trip_id/delete-item (Deleting single item from items array)", () => {
    test("200: Should delete single item from items array ", () => {
        const deleteChecklistItem = { item: "Check your passport" };
        return (0, supertest_1.default)(app_1.default)
            .patch(`/api/checklists/${user1.user_id}/${trip1.trip_id}/delete-item`)
            .send(deleteChecklistItem)
            .expect(200)
            .then(({ body: { checklist } }) => {
            expect(checklist).toEqual({
                checklist_id: expect.any(String),
                trip_id: expect.any(String),
                user_id: expect.any(String),
                items: [
                    {
                        item: "Print or download your tickets (flight/train/bus).",
                        completed: false,
                    },
                    { item: "Pack comfortable T-shirts/tops.", completed: false },
                    { item: "Dont forget your pants/shorts/skirts.", completed: false },
                    { item: "Pack comfortable shoes for walking.", completed: false },
                    { item: "Pack your toothbrush and toothpaste.", completed: false },
                    { item: "Bring your phone charger.", completed: false },
                    { item: "Pack a power bank for emergencies.", completed: false },
                ],
            });
        });
    });
    test("400: Should return an error msg if user id does not exist ", () => {
        const deleteChecklistItem = { item: "Check your passport" };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/checklists/10/1")
            .send(deleteChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Should return an error msg if trip id does not exist ", () => {
        const deleteChecklistItem = { item: "Check your passport" };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/checklists/1/10")
            .send(deleteChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Should return an error msg if user id is string ", () => {
        const deleteChecklistItem = { item: "Check your passport" };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/checklists/abc/1")
            .send(deleteChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Should return an error msg if trip id is string ", () => {
        const deleteChecklistItem = { item: "Check your passport" };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/checklists/1/abc")
            .send(deleteChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
});
describe("PATCH /api/checklists/:user_id/:trip_id/change-status", () => {
    test("200: Should patch checklist items ", () => {
        const inputChecklistItem = { newItem: "Check your passport" };
        return (0, supertest_1.default)(app_1.default)
            .patch(`/api/checklists/${user1.user_id}/${trip1.trip_id}/change-status`)
            .send(inputChecklistItem)
            .expect(200)
            .then(({ body: { checklist } }) => {
            expect(checklist).toEqual({
                checklist_id: expect.any(String),
                trip_id: expect.any(String),
                user_id: expect.any(String),
                items: [
                    { item: "Check your passport", completed: true },
                    {
                        item: "Print or download your tickets (flight/train/bus).",
                        completed: false,
                    },
                    { item: "Pack comfortable T-shirts/tops.", completed: false },
                    { item: "Dont forget your pants/shorts/skirts.", completed: false },
                    { item: "Pack comfortable shoes for walking.", completed: false },
                    { item: "Pack your toothbrush and toothpaste.", completed: false },
                    { item: "Bring your phone charger.", completed: false },
                    { item: "Pack a power bank for emergencies.", completed: false },
                ],
            });
        });
    });
    test("400: Should return an error msg if user id does not exist ", () => {
        const inputChecklistItem = { newItem: "new item" };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/checklists/10/1")
            .send(inputChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Should return an error msg if trip id does not exist ", () => {
        const inputChecklistItem = { newItem: "new item" };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/checklists/1/10")
            .send(inputChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Should return an error msg if user id is string ", () => {
        const inputChecklistItem = { newItem: "new item" };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/checklists/abc/1")
            .send(inputChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Should return an error msg if trip id is string ", () => {
        const inputChecklistItem = { newItem: "new item" };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/checklists/1/abc")
            .send(inputChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
});
describe("DELETE /api/checklists/:user_id/:trip_id", () => {
    test("204: Should delete entire checklist  ", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete(`/api/checklists/${user1.user_id}/${trip1.trip_id}`)
            .expect(204);
    });
    test("400: Should return an error msg if user id does not exist ", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/checklists/10/1")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("404: Should return an error msg if trip id does not exist ", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/checklists/1/10")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Should return an error msg if user id is string ", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/checklists/abc/1")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("400: Should return an error msg if trip id is string ", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/checklists/1/abc")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
});
