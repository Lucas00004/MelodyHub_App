const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const review = require('../controllers/review.controller')


//Lấy tất cả các review theo id_event, trong đó JOIN user và review để gọi xong trả luôn username đỡ gọi thêm api
router.get('/:id_event', review.getReview);

router.post('/',auth, review.createReview);

router.delete('/',auth, review.deleteReview);





module.exports = router;