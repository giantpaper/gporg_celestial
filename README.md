This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Blog Type

This is my ode to personal blogs from the early 2000s. People still blog in the 2020s...but through social media (via Twitter, Tiktok, Facebook, Instagram, etc). GPORG is me doing the same, but hosting it myself in a single site. It's also a nod to Tumblr (and other tumblelogs), which did the same.

### Blog Categories

The entire blog is split up into several smaller sub-blogs (represented as WP categories), so each post will only have one category.

The categories are split up as:

- The Paper: `/paper`					The Paper is a nod to normal "blog" blogs (just generic text blogs, that also featured images, videos, links, etc)
  - [...subcategories]				Text blogs usually had categories for each post, so The Paper has dynamic number of subcategories representing that
- Photoblog: `/photoblog`
- Microblog: `/microlog`
- Linklog:   `/linklog`

I might add more blog types/parent categories in the future as I find I have the energy for more blog post types.

## URL Structure

| URL Scheme                               | Description                                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `/`                                      | Home                                                                                                          |
| `/[page_slug]`                           | Static page (ex. `/about`, `/contact`)                                                                        |
| `/[category_slug]`                       | Main category page (ex. `/paper/information`)*                                                                |
| `/[category_slug]/[page_num]`            | Main category page with pagination (ex. `/paper/information/2`, on Page 2 of the subcategory **Information**) |
| `/[category_slug]/[post_id]/[post_slug]` | Blog post URL                                                                                                 |
| `/tag/[tag_slug]`                        | Tag URL                                                                                                       |
| `/tag/[tag_slug]/[page_num`              | Tag URL with pagination (ex. `/tag/dreams/2`, on Page 2 of the tag **#dreams**)                               |
