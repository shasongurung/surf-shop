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
    }]
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

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', PostSchema);