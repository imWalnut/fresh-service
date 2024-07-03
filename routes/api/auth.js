const express = require('express');
const router = express.Router();
const {user} = require('../../models');
const {Op} = require('sequelize');
const {BadRequestError, UnauthorizedError, NotFoundError} = require('../../utils/errors');
const {success, failure} = require('../../utils/responses');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * 管理员登录
 * POST /api/auth/signIn
 */
router.post('/signIn', async (req, res) => {
    try {
        const {login, password} = req.body;

        if (!login) {
            throw new BadRequestError('手机号/用户名必须填写。');
        }

        if (!password) {
            throw new BadRequestError('密码必须填写。');
        }

        const condition = {
            where: {
                [Op.or]: [
                    {phoneNumber: login},
                    {username: login}
                ]
            }
        };

        // 通过手机号或username，查询用户是否存在
        const userInfo = await user.findOne(condition);
        if (!userInfo) {
            throw new NotFoundError('用户不存在，无法登录。');
        }
        // 验证密码
        const isPasswordValid = bcrypt.compareSync(password, userInfo.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('密码错误。');
        }
        // 验证登录权限
        if (userInfo.role === 2) {
            throw new UnauthorizedError('您没有权限登录管理员后台。');
        }

        // 生成身份验证令牌
        const token = jwt.sign({
                userId: userInfo.id
            }, process.env.SECRET, {expiresIn: '1d'}
        );

        success(res, '登录成功。', {token});
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
