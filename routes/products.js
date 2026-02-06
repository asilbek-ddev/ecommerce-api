const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getDiscountedProducts,
} = require("../controllers/productController");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Mahsulotlar bilan ishlash (barchasini olish, ID bo'yicha, kategoriya bo'yicha, chegirmali mahsulotlar)
 */

/**
 * @swagger
 * /api/v1/main/products:
 *   get:
 *     summary: Barcha mahsulotlarni olish (filtrlash va saralash bilan)
 *     tags: [Products]
 *     description: Query parametrlar orqali mahsulotlarni filtrlash, saralash va qidiruv mumkin
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Kategoriya IDsi bo'yicha filtr
 *         example: 136
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Mahsulot nomi bo'yicha qidiruv
 *         example: "shampun"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *         description: Minimal narx (so'm)
 *         example: 20000
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *         description: Maksimal narx (so'm)
 *         example: 100000
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, rating, ordersQuantity, newest, popularity, discount]
 *         description: Saralash maydoni
 *         example: price
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Tartib (asc - o'sish bo'yicha, desc - kamayish bo'yicha)
 *         example: asc
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sahifa raqami
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Har bir sahifadagi mahsulotlar soni
 *       - in: query
 *         name: hasDiscount
 *         schema:
 *           type: boolean
 *         description: Faqat chegirmali mahsulotlarni ko'rsatish
 *         example: true
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli javob
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categoryId:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 productList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 offerDto:
 *                   type: object
 *                   nullable: true
 *       500:
 *         description: Server xatosi
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/v1/main/products/{id}:
 *   get:
 *     summary: ID bo'yicha bitta mahsulotni olish
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 18332
 *         description: Mahsulot IDsi
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli - bitta mahsulot ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Mahsulot topilmadi
 *       500:
 *         description: Server xatosi
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/v1/main/products/category/{categoryId}:
 *   get:
 *     summary: Kategoriya bo'yicha mahsulotlarni olish
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 136
 *         description: Kategoriya IDsi
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sahifa raqami
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Har bir sahifadagi mahsulotlar soni
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, rating, ordersQuantity, newest]
 *         description: Saralash maydoni
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Tartib
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli - kategoriyadagi mahsulotlar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       404:
 *         description: Kategoriya yoki mahsulot topilmadi
 *       500:
 *         description: Server xatosi
 */
router.get("/category/:categoryId", getProductsByCategory);

/**
 * @swagger
 * /api/v1/main/products/discounts:
 *   get:
 *     summary: Chegirmali mahsulotlarni olish
 *     tags: [Products]
 *     description: Eng katta chegirmaga ega yoki chegirmali mahsulotlar ro'yxati
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sahifa raqami
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Har bir sahifadagi mahsulotlar soni
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [discount, price, rating]
 *         description: Saralash (eng ko'p chegirma bo'yicha yoki narx bo'yicha)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Tartib
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli - chegirmali mahsulotlar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       500:
 *         description: Server xatosi
 */
router.get("/discounts", getDiscountedProducts);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         productId:
 *           type: integer
 *           example: 18332
 *         title:
 *           type: string
 *           example: "Bug'doy uni MAKFA , yuqori nav, 2 kg"
 *         sellPrice:
 *           type: integer
 *           example: 22000
 *         fullPrice:
 *           type: integer
 *           example: 31000
 *         compressedImage:
 *           type: string
 *           example: "https://images.uzum.uz/.../t_product_240_low.jpg"
 *         image:
 *           type: string
 *           example: "https://images.uzum.uz/.../t_product_540_high.jpg"
 *         rating:
 *           type: number
 *           example: 4.9
 *         reviewsQuantity:
 *           type: integer
 *           example: 3023
 *         ordersQuantity:
 *           type: integer
 *           example: 27521
 *         rOrdersQuantity:
 *           type: integer
 *           example: 27500
 *         isFavorite:
 *           type: boolean
 *           nullable: true
 *         isAdultCategory:
 *           type: boolean
 *         charityCommission:
 *           type: integer
 *         isEco:
 *           type: boolean
 *         hasVerticalPhoto:
 *           type: boolean
 *         badges:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               text:
 *                 type: string
 *               textColor:
 *                 type: string
 *               backgroundColor:
 *                 type: string
 *               description:
 *                 type: string
 *                 nullable: true
 *               link:
 *                 type: string
 *                 nullable: true
 *         titleBadges:
 *           type: array
 *           nullable: true
 *         categoryId:
 *           type: integer
 *           example: 136
 *         characteristicValueIds:
 *           type: array
 *           nullable: true
 *         skuGroupId:
 *           type: integer
 *           nullable: true
 *         discount:
 *           type: number
 *           nullable: true
 */

module.exports = router;