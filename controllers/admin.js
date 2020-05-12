const { validationResult } = require("express-validator");

const { Category, Place } = require("./../models/places");

exports.addPlace = (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    return res.json({ error: true, ...errors });
  }

  const point = {
    type: "Point",
    coordinates: [req.body.long, req.body.lat],
  };
  console.log(point);
  const newPlace = new Place({
    name: req.body.name,
    location: point,
  });

  newPlace
    .save()
    .then((result) => {
      res.status(201);
      return res.json({
        message: "created a place",
        data: newPlace,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      return res.json("something went wrong");
    });
};

exports.addCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    return res.json({ error: true, ...errors });
  }
  const { name, description } = req.body;

  try {
    const findCategory = await Category.findOne({
      name: { $regex: name, $options: "i" },
    });
    if (findCategory) {
      return res
        .status(400)
        .json({ message: "category with this name already exits" });
    }
    const category = await Category.create({
      name: name,
      description: description,
      createdBy: req.user.id,
    });
    res.status(201);
    return res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
};
