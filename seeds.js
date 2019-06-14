const faker = require('faker');
const Post  = require('./models/post');

async function seedPosts(){
    // remove all post
    await Post.remove({});
    for(const i of new Array(40)){
        const post = {
            title: faker.lorem.word(),
            description : faker.lorem.text(),
            coordinares:[51.509865, -0.118092],
            author : {
                '_id' : '5cfadf428bcead15541ecc72',
                'username' : 'shason'
            }
        }
        await Post.create(post);
    }
    console.log('40 new post created');
}
module.exports = seedPosts;