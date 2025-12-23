This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## URL Structure

| URL Scheme                               | Description                                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `/`                                      | Home                                                                                                          |
| `/[page_slug]`                           | Static page (ex. `/about`, `/contact`)                                                                        |
| `/[category_slug]`                       | Main category page (ex. `/paper/information`)                                                                 |
| `/[category_slug]/[page_num]`            | Main category page with pagination (ex. `/paper/information/2`, on Page 2 of the subcategory **Information**) |
| `/[category_slug]/[post_id]/[post_slug]` | Blog post URL                                                                                                 |
| `/tag/[tag_slug]`                        | Tag URL                                                                                                       |
| `/tag/[tag_slug]/[page_num`              | Tag URL with pagination (ex. `/tag/dreams/2`, on Page 2 of the tag **#dreams**)                               |