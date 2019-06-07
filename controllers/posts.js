const Post = require ('../models/post');
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
        res.render('posts/index', {posts});
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
        // use req.body to create a new post
        let post = await Post.create(req.body.post);
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
        let post = await Post.findByIdAndUpdate(req.params.id, req.body.post);
        res.redirect(`/posts/${post.id}`);
    },
    // Post Destroy
    async postDestroy(req,res,next){
        await Post.findByIdAndRemove(req.params.id);
        res.redirect('/posts');
    }

}