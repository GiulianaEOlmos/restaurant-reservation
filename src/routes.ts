import express from "express";
import RestaurantController from "./controllers/restaurantController";
import ReservationController from "./controllers/reservationController";

const router = express.Router();

router.get("/restaurants/search", RestaurantController.search);
router.post("/reservation/create", ReservationController.createReservation);
router.delete("/reservation/delete", ReservationController.deleteReservation);

export default router;
