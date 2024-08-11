import { Request, Response } from "express";
import ReservationController from "../controllers/reservationController";
import db from "../database";
import { randomUUID } from "crypto";

jest.mock("../database");
jest.mock("crypto", () => ({
  randomUUID: jest.fn(() => "mocked-uuid"),
}));

describe("ReservationController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {};
    statusMock = jest.fn().mockReturnValue(res);
    jsonMock = jest.fn();
    res.status = statusMock;
    res.json = jsonMock;
  });

  describe("createReservation", () => {
    it("should create a reservation successfully", async () => {
      req.body = {
        usersIds: "1,2",
        reservationTime: 1633036800,
        restaurant: {
          id: 1,
          name: "Test Restaurant",
          main_table_size: 4,
        },
      };

      (db.query as jest.Mock).mockResolvedValueOnce({});

      await ReservationController.createReservation(
        req as Request,
        res as Response
      );

      expect(db.query).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith({
        usersIds: "1,2",
        reservationTime: 1633036800,
        restaurant: {
          id: 1,
          name: "Test Restaurant",
          main_table_size: 4,
        },
        message: "Reservation created successfully",
        bulkIdReservation: "mocked-uuid",
      });
    });

    it("should return 400 if required fields are missing", async () => {
      req.body = {};

      await ReservationController.createReservation(
        req as Request,
        res as Response
      );

      expect(res.json).toHaveBeenCalledWith({
        error: "Missing required fields",
      });
    });
  });

  describe("deleteReservation", () => {
    it("should delete a reservation successfully", async () => {
      req.body = {
        bulkIdReservationId: "mocked-uuid",
      };

      (db.query as jest.Mock).mockResolvedValueOnce({});

      await ReservationController.deleteReservation(
        req as Request,
        res as Response
      );

      expect(res.json).toHaveBeenCalledWith({
        message: "Reservation deleted successfully",
      });
    });

    it("should return 400 if required fields are missing", async () => {
      req.body = {};

      await ReservationController.deleteReservation(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Missing required fields",
      });
    });
  });
});
