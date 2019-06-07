const Post = require ('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({accessToken : process.env.MAPBOX_TOKEN});
const cloudinary = require ('cloudinary');
cloudinary.config({
    cloud_name: 'shasongurung',
    api_key: '999837439277327',
    api_secret: process.env.CLOUDINARY_SECRET
});
module.exports={
    // Posts Index
    async postIndex(req,res,next){
        let posts = await Post.find({});
        res.render('posts/index', {posts, title: 'Posts Index'});
    },
    // Posts New
    postNew (req, res, next){
        res.render('posts/new');
    },
    // Posts Create
    async postCreate(req, res, next){
        req.body.post.images=[];
        for(const file of req.files){
            let image = await cloudinary.v2.uploader.upload(file.path);
            req.body.post.images.push({
                url: image.secure_url,
                public_id : image.public_id
            });
        }
        // get location coordinates as response
        let response = await geocodingClient
            .forwardGeocode({
                // passing location as query
                query: req.body.post.location,
                limit: 1
            })
            .send();
        // assign coordinates the response received
        req.body.post.coordinates = response.body.features[0].geometry.coordinates

        // use req.body to create a new post
        let post = await Post.create(req.body.post);
        req.session.success = 'Post created successfully';
        //`backtick` template literal
        res.redirect(`/posts/${post.id}`);
    },
    // Posts Show
    async postShow(req, res, next){
        let post = await Post.findById(req.params.id);
        res.render('posts/show', {post});
    },
    // Posts edit
    async postEdit(req, res, next){
        let post = await Post.findById(req.params.id);
        res.render('posts/edit', {post});
        // (req, res, next) => {
        //     res.send('/posts/:id/edit');
        //   }
    },
    // Post update
    async postUpdate(req, res, next){
        //find the post by id
        let post = await Post.findById(req.params.id);
        // check if there's any images for deletions
        if (req.body.deleteImages && req.body.deleteImages.length){
            // assign deleteimage from req.body to its own variable
            let deleteImages = req.body.deleteImages;
            //loop over deleteImages
            for (const public_id of deleteImages){
                // del images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);
                // del image form post.images
                for (const image of post.images){
                    if(image.public_id === public_id){
                        // get index of image fron post.images (post model)
                        // images is contains an array of image
                        let index= post.images.indexOf(image);
                        // now remove the image from the array using index
                        post.images.splice(index,1);
                    }
                }
            }
        }
        // check if any new images for upload
        if (req.files){
            //upload images
            for(const file of req.files){
                let image = await cloudinary.v2.uploader.upload(file.path);
                // add images to post.images array
                post.images.push({
                    url: image.secure_url,
                    public_id : image.public_id
                });
            }
        }

        // check change in location. if yes, get new coordinates using location value
        if (post.location!==req.body.post.location){
            // get location coordinates as response
            let response = await geocodingClient
            .forwardGeocode({
                // passing location as query
                query: req.body.post.location,
                limit: 1
            })
            .send();
            // assign coordinates the response received
            post.coordinates = response.body.features[0].geometry.coordinates
            post.location = req.body.post.location;
        }

        //update the post with new any new properties
        post.title = req.body.post.title;
        post.description = req.body.post.description;
        post.price = req.body.post.price;

        //save the updated post into the db
        post.save();
        //redirect to show page
        res.redirect(`/posts/${post.id}`);
    },
    // Post Destroy
    async postDestroy(req,res,next){
        let post = await Post.findById(req.params.id);
        for (const image of post.images){
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await post.remove();
        res.redirect('/posts');
    }

}