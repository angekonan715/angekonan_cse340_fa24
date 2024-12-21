const pool = require("../database/");

/*************
 * Get All Classification data
 *************/

async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

async function getClassificationbyId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.classification WHERE classification_id = $1`,
      [classification_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getclassificationsbyId error", error);
  }
}

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );

    // console.log("data", data.rows);
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyId error", error);
  }
}

async function getInventoryByVehicleId(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [vehicle_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("ERROR IN FETCHING VEHICLE DATA BY ID", error);
  }
}

async function addClassification(classification_name) {
  try {
    const data = await pool.query(
      `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *;`,
      [classification_name]
    );
    return data;
  } catch (error) {
    console.error("ERROR IN ADDING CLASSIFICATION", error);
  }
}

async function checkExistingClassification(classification_name) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.classification WHERE classification_name = $1`,
      [classification_name]
    );
    return data.rowCount;
  } catch (error) {
    console.error("ERROR IN CHECKING CLASSIFICATION", error);
  }
}

async function addInventory(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const data = await pool.query(
      `INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,inv_price, inv_miles, inv_color, classification_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
      [
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      ]
    );
    return data;
  } catch (error) {
    console.error("ERROR IN ADDING INVENTORY", error);
  }
}

async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  console.log(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );
  try {
    const data = await pool.query(
      `UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5,
      inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *`,
      [
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
        inv_id,
      ]
    );
    return data.rows[0];
  } catch (error) {
    console.error("ERROR IN UPDATE INVENTORY", error);
  }
}

async function deleteInventory(inv_id) {
  try {
    const data = await pool.query(
      `DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *`,
      [inv_id]
    );
    return data;
  } catch (error) {
    console.error("ERROR IN DELETE INVENTORY", error);
  }
}

module.exports = {
  getClassifications,
  getClassificationbyId,
  getInventoryByClassificationId,
  getInventoryByVehicleId,
  addClassification,
  checkExistingClassification,
  addInventory,
  updateInventory,
  deleteInventory,
};