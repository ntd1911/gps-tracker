require("dotenv").config();

const express =
require("express");

const cors =
require("cors");

require("./config/db");

const authRoutes =
require("./routes/authRoutes");

const geofenceRoutes =
require("./routes/geofenceRoutes");

const parkingRoutes =
require("./routes/parkingRoutes");

const deviceRoutes =
require("./routes/deviceRoutes");

const app = express();

app.use(cors());

app.use(express.json());

// ROUTES
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/geofence",
  geofenceRoutes
);

app.use(
  "/api/parking",
  parkingRoutes
);

app.use(
  "/api/device",
  deviceRoutes
);

app.get("/", (req, res) => {

  res.send(
    "GPS Backend Running"
  );

});

app.listen(
  process.env.PORT,
  () => {

    console.log(
      "Server running on port 3000"
    );

});