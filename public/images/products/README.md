# Product images

Convention: `/images/products/<product-slug>/<n>.jpg`, matching each
product's `slug` in the database (e.g. `maavitram-tez`) and referenced by
`Product.images` (see `prisma/seed.ts`).

```
public/images/products/
  maavitram-tez/
    1.jpg
    2.jpg
  maavitram-saumya/
    1.jpg
```

This file keeps the (currently empty) directory tracked in git until real
product photography is added.
