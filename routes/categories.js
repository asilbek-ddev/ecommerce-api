const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  getCategoryById,
} = require("../controllers/categoryController");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Mahsulot kategoriyalari (barchasini olish, ID bo'yicha ko'rish, ierarxik tuzilma)
 */

/**
 * @swagger
 * /api/v1/main/categories:
 *   get:
 *     summary: Barcha kategoriyalarni olish
 *     tags: [Categories]
 *     description: |
 *       Platformadagi barcha asosiy kategoriyalarni va ularning sub-kategoriyalarini ierarxik shaklda qaytaradi.
 *       Odatda faqat birinchi darajadagi (parent) kategoriyalar qaytariladi, lekin children massivi bilan birga.
 *     parameters:
 *       - in: query
 *         name: includeChildren
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Sub-kategoriyalarni (children) ham qaytarish kerakmi
 *       - in: query
 *         name: flat
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Ierarxiyani saqlamay, barcha kategoriyalarni tekis (flat) ro'yxat sifatida qaytarish
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Kategoriya nomi yoki slug bo'yicha qidiruv
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Qaytariladigan asosiy kategoriyalar soni
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli - kategoriyalar ro'yxati (ierarxik)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server xatosi
 */
router.get("/", getAllCategories);

/**
 * @swagger
 * /api/v1/main/categories/{id}:
 *   get:
 *     summary: ID bo'yicha bitta kategoriyani olish
 *     tags: [Categories]
 *     description: Muayyan kategoriya va uning sub-kategoriyalari haqida ma'lumot qaytaradi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10001
 *         description: Kategoriya IDsi
 *       - in: query
 *         name: depth
 *         schema:
 *           type: integer
 *           default: 3
 *           enum: [1, 2, 3, all]
 *         description: Sub-kategoriyalarni qanchalik chuqur qaytarish kerak (masalan 1 - faqat birinchi daraja)
 *       - in: query
 *         name: includeProductsCount
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Ushbu kategoriyadagi mahsulotlar sonini qaytarish
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli - kategoriya va uning sub-kategoriyalari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Kategoriya topilmadi
 *       500:
 *         description: Server xatosi
 */
router.get("/:id", getCategoryById);

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10001
 *         title:
 *           type: string
 *           example: "Turizm, baliq ovi va ovchilik"
 *         name:
 *           type: string
 *           nullable: true
 *           example: null
 *           description: Ba'zi sub-kategoriyalarda "title" o'rniga "name" ishlatilishi mumkin
 *         slug:
 *           type: string
 *           example: "turizm-baliq-ovi-va"
 *         image_url:
 *           type: string
 *           nullable: true
 *           example: ""
 *           description: Kategoriya rasmi (ko'pincha bo'sh bo'lishi mumkin)
 *         children:
 *           type: array
 *           nullable: true
 *           items:
 *             $ref: '#/components/schemas/Category'
 *           description: Sub-kategoriyalar (rekursiv tuzilma)
 */

module.exports = router;