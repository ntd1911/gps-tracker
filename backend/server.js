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

const phoneRoutes =
require("./routes/phoneRoutes");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

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

app.use(
  "/api/phone",
  phoneRoutes
);

app.get("/", (req, res) => {

  res.send(
    "GPS Backend Running"
  );

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});