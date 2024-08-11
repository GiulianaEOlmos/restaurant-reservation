import { Request, Response } from "express";
import db from "../database";
import { RowDataPacket } from "mysql2";
import { randomUUID } from "crypto";

interface createReservationRequest {
  usersIds: string;
  reservationTime: number; //timestamp
  restaurant: {
    id: number;
    name: string;
    main_table_size: number;
  };
}

interface deleteReservationRequest {
  bulkIdReservationId: string;
}

class ReservationController {
  async createReservation(req: Request, res: Response) {
    try {
      const { usersIds, reservationTime, restaurant } =
        req.body as unknown as createReservationRequest;

      const users = usersIds?.split(",").map(Number);

      if ((users && users.length < 1) || !reservationTime || !restaurant) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const promises: Promise<any>[] = [];

      const bulkIdReservation = randomUUID();

      users.forEach((userId) => {
        const query = `
        INSERT INTO Reservations (user_id, restaurant_id, table_size, reservation_time, bulk_id_reservation)
        VALUES (?, ?, ?, FROM_UNIXTIME(?), ?)
        `;

        const values = [
          userId,
          restaurant.id,
          restaurant.main_table_size,
          reservationTime,
          bulkIdReservation,
        ];
        promises.push(db.query(query, values));
      });

      await Promise.all(promises);

      res.json({
        usersIds,
        reservationTime,
        restaurant,
        message: "Reservation created successfully",
        bulkIdReservation,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteReservation(req: Request, res: Response) {
    try {
      const { bulkIdReservationId } =
        req.body as unknown as deleteReservationRequest;

      if (!bulkIdReservationId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const query = `
      DELETE FROM Reservations
      WHERE bulk_id_reservation = ?
      `;

      await db.query(query, [bulkIdReservationId]);

      res.json({ message: "Reservation deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ReservationController();
