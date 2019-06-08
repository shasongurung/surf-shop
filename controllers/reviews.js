const Post = require ('../models/post');
const Review = require ('../models/review');

module.exports={
    // Reviews Create
    async reviewCreate(req, res, next){
       // find the post by its id
        let post = await Post.findById(req.params.id).populate('reviews').exec();
        // check any reviews related to the user
        let haveReviewed = post.reviews.filter(review => {
            return review.author.equals(req.user._id);
        }).length; //yes or no (0 or 1)
        // if yes
        if (haveReviewed){
            req.session.error = "Sorry, only one review per post allowed";
            return res.redirect(`/posts/${post.id}`);
        }

        // create the review
        req.body.review.author = req.user._id;
        let review = await Review.create(req.body.review);
        // assign review to post
        post.reviews.push(review);
        //save the post
        post.save();
        // redirect to the post
        // flash the success maessge
        req.session.success ='Review created successfully!';
        res.redirect(`/posts/${post.id}`);
    },
    // Reviews update
    async reviewUpdate(req, res, next){
       await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
       req.session.success = 'Review updated successfully!';
       res.redirect(`/posts/${req.params.id}`);
    },
    // Reviews Destroy
    async reviewDestroy(req,res,next){
        // pull review out of the given post first
        await Post.findByIdAndUpdate(req.params.id,{
            $pull: {reviews : req.params.review_id}
        });
        // actual remove
        await Review.findByIdAndRemove(req.params.review_id);
        req.session.success = 'Review removed successfully!';
        res.redirect(`/posts/${req.params.id}`);
    }

}