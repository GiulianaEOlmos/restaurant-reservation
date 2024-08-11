import { Request, Response } from "express";
import db from "../database";
import { RowDataPacket } from "mysql2";

interface searchRestaurantRequest {
  userId: number;
  friends: number[];
  reservationTime: number; //timestamp
  customerNumber: number;
}

class RestaurantController {
  async search(req: Request, res: Response) {
    try {
      const { userId, friends, reservationTime, customerNumber } =
        req.body as unknown as searchRestaurantRequest;

      if (!userId || !reservationTime) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (customerNumber > 6) {
        return res
          .status(400)
          .json({ error: "Customer number must be less than 6 people" });
      }

      if (customerNumber < 1) {
        return res
          .status(400)
          .json({ error: "Custumer number must be greater than 0" });
      }

      if (friends.length + 1 > customerNumber) {
        return res
          .status(400)
          .json({ error: "The number of customer is incorrect" });
      }

      const connection = await db.getConnection();

      if (friends.length != 0) {
        const [friendsFound] = await connection.query<RowDataPacket[]>(
          "SELECT * FROM users WHERE id IN (?)",
          [friends]
        );

        if (friendsFound.length != friends.length) {
          return res
            .status(404)
            .json({ error: "Some friends doesn't exist in the database" });
        }
      }

      const usersIds = [...friends, userId].join(",");

      const queryGetUsersWithReservation = `
      SELECT user_id
      FROM Reservations
      WHERE user_id IN (${usersIds})
      AND reservation_time BETWEEN FROM_UNIXTIME(${reservationTime}) AND TIMESTAMPADD(HOUR, 2, FROM_UNIXTIME(${reservationTime}))
      GROUP BY user_id;
      `;

      const [usersWithReservation] = await connection.query<RowDataPacket[]>(
        queryGetUsersWithReservation
      );

      if (usersWithReservation.length > 0) {
        return res.status(400).json({
          error:
            "One or more users already have a reservation in the same time",
        });
      }

      const query = `
    SELECT 
        r.id, 
        r.name, 
        CASE
            WHEN ${customerNumber} <= 2 AND available_tables.available_two_top > 0 THEN 2
            WHEN ${customerNumber} <= 4 AND available_tables.available_four_top > 0 THEN 4
            WHEN ${customerNumber} <= 6 AND available_tables.available_six_top > 0 THEN 6
            ELSE NULL
        END AS main_table_size
    FROM 
        Restaurants r
    JOIN 
        RestaurantEndorsements re ON r.id = re.restaurant_id
    JOIN (
        SELECT 
            r.id,
            r.num_two_top_tables - COALESCE(SUM(CASE WHEN res.table_size = 2 THEN 1 ELSE 0 END), 0) AS available_two_top,
            r.num_four_top_tables - COALESCE(SUM(CASE WHEN res.table_size = 4 THEN 1 ELSE 0 END), 0) AS available_four_top,
            r.num_six_top_tables - COALESCE(SUM(CASE WHEN res.table_size = 6 THEN 1 ELSE 0 END), 0) AS available_six_top
        FROM 
            Restaurants r
        LEFT JOIN 
            Reservations res ON r.id = res.restaurant_id AND res.reservation_time BETWEEN FROM_UNIXTIME(${reservationTime}) AND TIMESTAMPADD(HOUR, 2, FROM_UNIXTIME(${reservationTime}))
        GROUP BY 
            r.id, r.num_two_top_tables, r.num_four_top_tables, r.num_six_top_tables
    ) AS available_tables ON r.id = available_tables.id
    WHERE 
        re.diet_option_id IN (
            SELECT DISTINCT 
                de.id
            FROM 
                UserDietaryRestrictions udr
            JOIN 
                DietOption de ON udr.diet_option_id = de.id
            WHERE 
                udr.user_id IN (2, 3, 5)
        )
    AND (
        (${customerNumber} <= 2 AND available_tables.available_two_top > 0) OR
        (${customerNumber} <= 4 AND available_tables.available_four_top > 0) OR
        (${customerNumber} <= 6 AND available_tables.available_six_top > 0)
    )
    GROUP BY 
        r.id, r.name
    ORDER BY 
        main_table_size;
    `;

      const [restaurants] = await connection.query(query);
      connection.release();
      res.json({ restaurants, reservationTime, usersIds });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new RestaurantController();
