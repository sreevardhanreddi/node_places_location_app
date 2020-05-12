const { validationResult } = require("express-validator");

const { Place, Category } = require("./../models/places");

exports.allPlaces = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    return res.json({ error: true, ...errors });
  }

  try {
    const name = req.query.name;
    const lat = req.query.lat;
    const long = req.query.long;
    // maxDistance is in meters
    const maxDistance = req.query.distance || 1 * 1000 * 1000;

    let filterObj = {};

    if (name) {
      // %ilike%
      filterObj = {
        name: { $regex: name, $options: "i" },
      };
    }

    if (lat && long) {
      filterObj = {
        ...filterObj,
        location: {
          $near: {
            $maxDistance: maxDistance,
            $geometry: {
              type: "Point",
              coordinates: [long, lat],
            },
          },
        },
      };
      //  https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
      // check the stackoverflow post to calculate the distance on the frontend
      // $geoNear is an aggregation the database takes the responsibility to calculate
      // the distance and converts to the given format miles/km
      // it is very expensive operation
      //   filterObj = {
      //     $geoNear: {
      //       near: {
      //         type: "Point",
      //         coordinates: [long, lat],
      //       },
      //       spherical: true,
      //       maxDistance: maxDistance,
      //       distanceMultiplier: 1 / 1609.34,
      //       distanceField: "distance",
      //     },
      //   };
    }

    // console.log(filterObj);
    // console.log(JSON.stringify(filterObj, null, 4));

    const places = await Place.find(filterObj);
    res.status(200);
    return res.json(places);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
};

exports.allCategories = async (req, res, next) => {
  try {
    // const categories = await Category.find().populate("createdBy");
    const categories = await Category.find().populate(
      "createdBy",
      "username email"
    );

    return res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    return res.json(500).end();
  }
};
