const express = require('express');
const router = express.Router();
const {banner} = require('../../models')
const {Op} = require('sequelize')
const {NotFoundError} = require('../../utils/errors');
const {success, failure} = require('../../utils/responses');

/**
 * 新增轮播图
 * POST /api/shop/addBannerInfo
 */
router.post('/addBannerInfo', async function (req, res, next) {
    try {
        const body = {
            imgUrl: req.body.imgUrl,
            hrefUrl: req.body.hrefUrl,
            source: req.body.source
        }
        const bannerInfo = await banner.create(body)
        success(res, '新增轮播图成功', {bannerInfo}, 201);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 删除轮播图
 * DELETE /api/shop/deleteBannerInfo/:id
 */
router.delete('/deleteBannerInfo/:id', async function (req, res, next) {
    try {
        // 获取轮播图 ID
        const {id} = req.params;
        // 查询轮播图
        const bannerInfo = await banner.findByPk(id);
        await bannerInfo.destroy()
        success(res, '删除轮播图成功');
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 获取轮播图
 * GET /api/shop/getBannerList
 */
router.get('/getBannerList', async function (req, res, next) {
    try {
        let banners = await banner.findAll()
        success(res, '获取轮播图成功', banners);
    } catch (err) {
        failure(res, err)
    }
});

module.exports = router;