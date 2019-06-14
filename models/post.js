const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const mongoosePaginate = require('mongoose-paginate');

const PostSchema = new Schema({
    title: String,
    price : String,
    description : String,
    images : [{url :String, public_id:String}],
    location : String,
    coordinates: Array,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : 'Review'
    }],
    avgRating:{ type: Number, default:0}
});

//prehook middleware
//anytime post.remove gets called, the following will be executed
// this refer to the post that called post.remove method in posts controller
PostSchema.pre('remove', async function(){
    await Review.remove({
        _id: {
            $in: this.reviews
        }
    });
});

// adding instance method calculateAvgRating
PostSchema.methods.calculateAvgRating = function(){
    let ratingsTotal = 0;
    if(this.reviews.length){
        this.reviews.forEach(review => {
            ratingsTotal += review.rating;
        });
        this.avgRating = Math.round((ratingsTotal / this.reviews.length)*10)/ 10;
    }else{
        this.avgRating = ratingsTotal;
    }
    const floorRating = Math.floor(this.avgRating);
    this.save();
    return floorRating;
   
};

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', PostSchema);