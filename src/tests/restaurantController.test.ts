import { Request, Response } from "express";
import RestaurantController from "../controllers/restaurantController";
import db from "../database";

jest.mock("../database");

describe("RestaurantController.search", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = {
      body: {
        userId: 1,
        friends: [2, 3],
        reservationTime: 1625247600,
        customerNumber: 4,
      },
    };
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if required fields are missing", async () => {
    req.body.userId = undefined;
    await RestaurantController.search(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Missing required fields" });
  });

  it("should return 400 if customer number is greater than 6", async () => {
    req.body.customerNumber = 7;
    await RestaurantController.search(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Customer number must be less than 6 people",
    });
  });

  it("should return 400 if customer number is less than 1", async () => {
    req.body.customerNumber = 0;
    await RestaurantController.search(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Custumer number must be greater than 0",
    });
  });

  it("should return 400 if number of friends exceeds customer number", async () => {
    req.body.customerNumber = 2;
    await RestaurantController.search(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "The number of customer is incorrect",
    });
  });

  it("should return 404 if some friends do not exist in the database", async () => {
    (db.getConnection as jest.Mock).mockResolvedValue({
      query: jest.fn().mockResolvedValue([[]]),
      release: jest.fn(),
    });
    await RestaurantController.search(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Some friends doesn't exist in the database",
    });
  });

  it("should return 400 if one or more users already have a reservation at the same time", async () => {
    (db.getConnection as jest.Mock).mockResolvedValue({
      query: jest
        .fn()
        .mockResolvedValueOnce([[{ id: 2 }, { id: 3 }]]) // Friends exist
        .mockResolvedValueOnce([[{ user_id: 2 }]]), // One friend has a reservation
      release: jest.fn(),
    });

    await RestaurantController.search(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "One or more users already have a reservation in the same time",
    });
  });

  it("should return restaurants if all conditions are met", async () => {
    (db.getConnection as jest.Mock).mockResolvedValue({
      query: jest
        .fn()
        .mockResolvedValueOnce([[{ id: 2 }, { id: 3 }]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[]]),
      release: jest.fn(),
    });
    await RestaurantController.search(req as Request, res as Response);
    expect(jsonMock).toHaveBeenCalledWith({
      restaurants: [],
      reservationTime: 1625247600,
      usersIds: "2,3,1",
    });
  });

  it("should return 500 if an error occurs", async () => {
    db.getConnection = jest.fn().mockImplementation(() => {
      return Promise.reject(new Error("Database error"));
    });
    await RestaurantController.search(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Database error" });
  });
});
