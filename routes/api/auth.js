const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const {user} = require('../../models');
const {Op} = require('sequelize');
const {BadRequestError, UnauthorizedError, NotFoundError} = require('../../utils/errors');
const {success, failure} = require('../../utils/responses');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

let cachedAccessToken
let accessTokenExpiresAt = 0

/**
 *公共方法 获取微信token
 */

async function getAccessToken() {
    if (cachedAccessToken && (Date.now() < accessTokenExpiresAt)) {
        return cachedAccessToken
    }
    // 获取token
    const resClient = await axios.get("https://api.weixin.qq.com/cgi-bin/token", {
        params: configClient
    })

    const accessToken = resClient.data.access_token

    cachedAccessToken = accessToken

    accessTokenExpiresAt = Date.now() + (7200 * 1000)

    return accessToken
}

/**
 * 用户登录
 * POST /api/auth/signIn
 */
router.post('/signIn', async (req, res) => {
    try {
        const {code, encryptedData, iv} = req.body;

        const configAuthority = {
            appid: '',
            secret: '',
            code,
            grant_type: 'authorization_code'
        }

        const configClient = {
            appid: '',
            secret: '',
            grant_type: 'client_credential'
        }

        let openId

        if (!code) {
            throw new BadRequestError('没有code参数');
        }

        if (!encryptedData) {
            throw new BadRequestError('没有code参数');
        }

        if (!iv) {
            throw new BadRequestError('没有code参数');
        }

        // 获取openid
        const resAuthority = await axios.get("https://api.weixin.qq.com/sns/jscode2session", {
            params: configAuthority
        })

        if (resAuthority.data.errcode) {
            throw new BadRequestError('非法的用户凭证');
        }
        openId = resAuthority.data.openid

        let data

        const userInfo = await user.findOne({where: {openId: openId}})

        if (userInfo) {
            data = userInfo
        } else {
            const accessToken = await getAccessToken()
            // 获取手机号
            const response = await axios.get(`https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`, {
                code: code
            })

            const phoneNumber = response.data

            const userByPhoneNUmber = await user.findOne({where: {phoneNumber: phoneNumber}})

            if (userByPhoneNUmber) {
                userByPhoneNUmber.openId = openId
                await userByPhoneNUmber.save()
                data = userByPhoneNUmber
            } else {
                const body = {
                    phoneNumber: phoneNumber,
                    role: 2,
                    password: phoneNumber,
                    userName: 'htg' + crypto.randomBytes(8) + phoneNumber.slice(-4),
                    status: 0,
                    openId: openId,
                }
                data = await user.create(body)
            }
        }

        // 生成身份验证令牌
        const token = jwt.sign({
                userId: data.id,
                role: data.role
            }, process.env.SECRET, {expiresIn: '1d'}
        );

        success(res, '登录成功', {
            data,
            token
        });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 注册用户
 * POST /api/auth/signUp
 */
router.post('/signUp', async function (req, res, next) {
    try {
        const body = req.body
        if (!body.shopName) {
            throw new UnauthorizedError('请请输入店铺名称');
        }
        if (!body.images) {
            throw new UnauthorizedError('请上传门店照片');
        }
        if (!body.inviteBy) {
            throw new UnauthorizedError('请输入邀请人手机号');
        }
        // 验证邀请人是否存在
        const userInvite = await user.findOne({
            where: {
                phoneNumber: {
                    [Op.eq]: body.inviteBy
                }
            }
        });
        if (!userInvite) {
            throw new UnauthorizedError('请输入有效的邀请人手机号');
        }
        const params = {
            phoneNumber: req.body.phoneNumber,
            name: req.body.name,
            sex: req.body.sex,
            provinceCode: req.body.provinceCode,
            provinceName: req.body.provinceName,
            cityCode: req.body.cityCode,
            cityName: req.body.cityName,
            countyCode: req.body.countyCode,
            countyName: req.body.countyName,
            address: req.body.address,
            role: 2,
            inviteBy: req.body.inviteBy,
            password: req.body.password,
            userName: req.body.userName,
            avatar: req.body.avatar,
            images: req.body.images,
            shopName: req.body.shopName,
            remark: req.body.remark,
            status: 0
        }
        const userInfo = await user.create(params)
        success(res, '注册成功', {userInfo}, 201);
    } catch (err) {
        failure(res, err)
    }
});

/**
* 后台登录
* POST /api/auth/login
*/
router.post('/login', async (req, res) => {
    try {
        const {login, password} = req.body;

        if (!login) {
            throw new BadRequestError('手机号/用户名必须填写');
        }

        if (!password) {
            throw new BadRequestError('密码必须填写');
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
            throw new NotFoundError('用户不存在，无法登录');
        }

        // 验证密码
        const isPasswordValid = bcrypt.compareSync(password, userInfo.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('密码错误');
        }
        // 验证当前用户是否是管理员或销售 0管理员 1销售 2用户
        if (userInfo.role === 2) {
            throw new UnauthorizedError('您没有权限使用当前接口')
        }

        // 生成身份验证令牌
        const token = jwt.sign({
                userId: userInfo.id,
                role: userInfo.role
            }, process.env.SECRET, {expiresIn: '1d'}
        );

        success(res, '登录成功', {token});
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
