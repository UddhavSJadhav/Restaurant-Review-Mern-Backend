import express from "express";
import RestaurantsCtrl from "../controllers/restaurants.controller.js";
import ReviewsCtrl from "../controllers/reviews.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(RestaurantsCtrl.apiGetRestaurants);
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById);
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines);

/*use auth middleware for review route
eg.
router
  .route("/review")
  .post(auth,ReviewsCtrl.apiPostReview)
  .put(auth,ReviewsCtrl.apiUpdateReview)
  .delete(auth,ReviewsCtrl.apiDeleteReview);
to check if user is authenticated and valid
*/

router
  .route("/review")
  .post(auth, ReviewsCtrl.apiPostReview)
  .put(auth, ReviewsCtrl.apiUpdateReview)
  .delete(auth, ReviewsCtrl.apiDeleteReview);

export default router;
