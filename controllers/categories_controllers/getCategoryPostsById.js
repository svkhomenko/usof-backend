const path = require("path");
const fs  = require("fs");
const { Op } = require("sequelize");
const db = require("../../models/init.js");
const ValidationError = require('../../errors/ValidationError');
const { verifyJWTToken } = require('../../token/tokenTools');
const sequelize = db.sequelize;
const User = db.sequelize.models.user;
const Post = db.sequelize.models.post;
const LikeForPost = db.sequelize.models.likeForPost;
const Category = db.sequelize.models.category;

const tokenFilePath = path.resolve("configs", "token-config.json");
const tokenOptFile = fs.readFileSync(tokenFilePath);
const tokenOptions = JSON.parse(tokenOptFile);

async function getCategoryPostsById(req, res) {
    const token = req.headers.authorization;
    const categoryId = req.params.category_id;

    try {
        let decoded;
        let curUser;
        
        try {
            decoded = await verifyJWTToken(token, tokenOptions.secret);
        }
        catch (err) {}

        if (decoded && decoded.id) {
            curUser = await User.findByPk(decoded.id);
        }

        const curCategory = await Category.findByPk(categoryId);
        if (!curCategory) {
            throw new ValidationError("No category with this id", 400);
        }

        let limit = 10;
        let offset = 0;
        if (req.query.page) {
            if (req.query.page < 1) {
                throw new ValidationError("No such page", 400);
            }
            offset = (req.query.page - 1) * limit;
        }

        let orderBy = [
            ['countLikes', 'DESC'],
            ['publishDate', 'DESC']
        ];
        if (req.query.orderBy == "date") {
            orderBy = [
                ['publishDate', 'DESC'],
                ['countLikes', 'DESC']
            ]; 
        }
        
        let where = {};
        if (curUser && curUser.role === 'admin') {
            if (req.query.filterStatus) {
                let filterStatus = req.query.filterStatus.split(',');
                where = {
                    status: {
                        [Op.in]: filterStatus 
                    }
                };
            }
        }
        else {
            where = {
                status: 'active'
            }
        }
        
        if (req.query.search) {
            where = {
                ...where,
                [Op.or]: [
                    { 
                        title: {
                            [Op.substring]: req.query.search
                        }
                    },
                    { 
                        content: {
                            [Op.substring]: req.query.search
                        }
                    }
                ] 
            };
        }

        if (req.query.filterDate) {
            let filterDate = req.query.filterDate.split('...');
            let valid0 = (new Date(filterDate[0])).getTime() > 0;
            let valid1 = (new Date(filterDate[1])).getTime() > 0;

            if ((!valid0 && filterDate[0]) || (!valid1 && filterDate[1])) {
                throw new ValidationError("FilterDate is invalid", 400);
            }
            
            if (valid0 && !valid1) {
                where = {
                    ...where,
                    publishDate: {
                        [Op.gte]: filterDate[0]
                    }
                };
            }
            else if (!valid0 && valid1) {
                where = {
                    ...where,
                    publishDate: {
                        [Op.lte]: filterDate[1]
                    }
                };
            }
            else if (valid0 && valid1) {
                where = {
                    ...where,
                    publishDate: {
                        [Op.between]: [filterDate[0], filterDate[1]]
                    }
                };
            }
        }
        
        let {count: countPosts, rows: allPosts} = await Post.findAndCountAll({
            subQuery: false,
            where: where,
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('likeForPosts.postId')), 'countLikes']
                ]
            },
            include: [
                {
                    model: User,
                    as: 'postAuthor'
                },
                {
                    attributes: [],
                    model: LikeForPost,
                    where: {
                        type: "like"
                    },
                    required: false
                },
                {
                    model: User,
                    as: "addToFavoritesUser",
                    where: {
                        id: (curUser ? curUser.id : 0)
                    },
                    required: false
                },
                {
                    model: Category,
                    where: {
                        id: categoryId
                    }
                }
            ],
            group: ['post.id'],
            order: orderBy,
            offset: offset,
            limit: limit,
            distinct: true
        });

        allPosts = await Promise.all(allPosts.map(async (post) => {
            let [ownlike] = await post.getLikeForPosts({ where: { author: (curUser ? curUser.id : 0) } });

            return ({
                id: post.id,
                title: post.title,
                publishDate: post.publishDate,
                status: post.status,
                content: post.content,
                author: {
                    id: post.postAuthor.id,
                    login: post.postAuthor.login,
                    fullName: post.postAuthor.fullName,
                    email: post.postAuthor.email,
                    role: post.postAuthor.role,
                    profilePicture: post.postAuthor.profilePicture,
                    rating: await post.postAuthor.getRating(),
                    status: post.postAuthor.status
                },
                images: (await post.getImageFromPosts()).map(image => {
                    return ({
                        id: image.id,
                        image: image.image
                    });
                }),
                addToFavoritesUser: !!post.addToFavoritesUser.length,
                isLiked: (ownlike ? { type: ownlike.type } : false),
                categories: (await post.getCategories()).map(category => {
                    return ({
                        id: category.id,
                        title: category.title,
                        description: category.description
                    });
                }),
                likesCount: await post.countLikeForPosts( { where: { type: "like" } }),
                dislikesCount: await post.countLikeForPosts( { where: { type: "dislike" } })
            });
        }));
        
        res.status(200)
            .json({
                limit,
                countPosts: countPosts.length,
                allPosts
            });
    }
    catch(err) {
        if (err instanceof ValidationError) {
            res.status(err.status)
                .json({ message: err.message });
        }
        else if (err.name == 'SequelizeValidationError') {
            res.status(400)
                .json({ message: err.errors[0].message });
        }
        else {
            console.log('err', err);

            res.status(500)
                .json({ message: err });
        } 
    }    
}

module.exports = getCategoryPostsById;

