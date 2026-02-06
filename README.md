# Uzum E-commerce API

**Base URL:**  
`https://ecommerce-uzum-api.onrender.com`

Asosiy endpoint:  
`/api/v1/main/products`

### Asosiy imkoniyatlar (query parametrlar)

| Parametr       | Tavsif                              | Misol                              |
|----------------|-------------------------------------|------------------------------------|
| `categoryId`   | Kategoriya bo‘yicha                 | ?categoryId=136                    |
| `search`       | Qidiruv                             | ?search=shampun                    |
| `minPrice`     | Minimal narx                        | ?minPrice=20000                    |
| `maxPrice`     | Maksimal narx                       | ?maxPrice=100000                   |
| `sortBy`       | Saralash: price, rating, popularity, newest, discount | ?sortBy=price             |
| `order`        | asc / desc                          | ?order=asc                         |
| `brand`        | Brend(lar)                          | ?brand=NIVEA,MAKFA                 |
| `hasDiscount`  | Chegirmali mahsulotlar              | ?hasDiscount=true                  |
| `minRating`    | Minimal reyting                     | ?minRating=4.5                     |
| `page`         | Sahifa                              | ?page=1                            |
| `limit`        | Elementlar soni                     | ?limit=20                          |

### To‘liq hujjat va sinov
To‘liq endpointlar ro‘yxati va interaktiv sinov uchun quyidagilarni oching:  
→ https://ecommerce-uzum-api.onrender.com/api/v1/swagger 

(Agar ochilmasa, loyiha egasidan so‘rang yoki /api/v1/main/products?f=docs kabi variantlarni sinab ko‘ring)
