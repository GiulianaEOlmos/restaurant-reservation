# Restaurant Reservation System

## Introduction

The Restaurant Reservation System is a web application designed to manage reservations for a restaurant. It allows users to create, view, and manage reservations efficiently. The system is built using Node.js, Express, and a MySQL database.

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v14 or higher)
- MySql
- Git

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/GiulianaEOlmos/Rec-Booking-Restaurant.git
   cd restaurant-reservation
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Set up the database**

   - Create a local database using the queries in the fold `./src/queries`
   - Run first `createTables` and then `insertData`
   - Update the database configuration in src/database.ts with your database credentials.

4. **Run the server**

   ```bash
   npm run start
   ```

   The server will start on http://localhost:3000.

### Runing tests

To run the tests, use the following command:

```bash
npm run test
```

#### API Endpoints

#### Get Restaurants

```
GET /api/restaurants/search
```

Request Body

```json
{
  "userId": 5,
  "friends": [3],
  "reservationTime": "1723406400",
  "customerNumber": 4
}
```

Response Body

```json
{
  "restaurants": [
    {
      "id": 1,
      "name": "Lardo",
      "main_table_size": 4
    },
    {
      "id": 2,
      "name": "Panadería Rosetta",
      "main_table_size": 4
    },
    {
      "id": 3,
      "name": "Tetetlán",
      "main_table_size": 4
    }
  ],
  "reservationTime": "1723406400",
  "usersIds": "3,5"
}
```

#### POST Create Reservation

```
POST /api/reservation/create
```

Request Body

```json
{
  "restaurant": {
    "id": 3,
    "name": "Tetetlán",
    "main_table_size": 6
  },
  "reservationTime": 1723406400,
  "usersIds": "2,6,1"
}
```

Response Body

```json
{
  "usersIds": "2,6,1",
  "reservationTime": 1723406400,
  "restaurant": {
    "id": 3,
    "name": "Tetetlán",
    "min_table_size": 4
  },
  "message": "Reservation created successfully",
  "bulkIdReservation": "43355296-fa36-4b00-b9f0-080293b106a0"
}
```

#### DELETE Reservation

```
POST /api/reservation/delete
```

Request Body

```json
{
  "bulkIdReservationId": "693f7cc5-adc5-4e26-815f-93b36015f379"
}
```

Response Body

```json
{
  "message": "Reservation deleted successfully"
}
```

#### Postman Collection

You can import the postman collection using this json `BookingApp.postman_collection` in the root of the project
