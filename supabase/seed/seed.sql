-- Optional demo content for the VelNit Life blog.
-- Run after 0001_init.sql if you want sample posts to appear immediately.

insert into public.authors (id, name, avatar_url, bio)
values (
  '11111111-1111-1111-1111-111111111111',
  'The VelNit Life Team',
  '/images/team/velnit-avatar.png',
  'Building Relationship Intelligence for life''s second chapter.'
)
on conflict (id) do nothing;

insert into public.categories (id, name, slug) values
  ('22222222-2222-2222-2222-222222222221', 'Relationship Intelligence', 'relationship-intelligence'),
  ('22222222-2222-2222-2222-222222222222', 'Caregiving', 'caregiving'),
  ('22222222-2222-2222-2222-222222222223', 'The TALK Model', 'talk-model')
on conflict (id) do nothing;

insert into public.tags (id, name, slug) values
  ('33333333-3333-3333-3333-333333333331', 'Empty Nest', 'empty-nest'),
  ('33333333-3333-3333-3333-333333333332', 'Loneliness', 'loneliness'),
  ('33333333-3333-3333-3333-333333333333', 'Couples', 'couples')
on conflict (id) do nothing;

insert into public.blog_posts
  (id, title, slug, excerpt, content, featured_image, author_id, category_id, seo_title, seo_description, status, published_at)
values (
  '44444444-4444-4444-4444-444444444441',
  'From Silence to Connection: Why Relationship Intelligence Matters Now',
  'from-silence-to-connection',
  'Life''s second chapter brings a quiet risk: emotional distance. Here is why we built VelNit Life around Relationship Intelligence instead of another care-management app.',
  '## The quiet risk of the second chapter\n\nRetirement, an empty nest, health changes - the second half of life brings freedom, but also silence. Not the illness. The distance.\n\n## What Relationship Intelligence means\n\nRelationship Intelligence is the practice of noticing, nurturing, and actively strengthening the emotional bonds that keep us well as we age - between partners, across generations, and within communities.\n\n## The TALK Model\n\n**T**ogether time. **A**cknowledgment. **L**istening. **K**indness in small moments. A simple framework for staying close, on purpose.',
  '/images/blog/from-silence-to-connection.jpg',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222221',
  'From Silence to Connection | VelNit Life',
  'Why Relationship Intelligence - not another elder care app - is what families need for life''s second chapter.',
  'published',
  now() - interval '7 days'
),
(
  '44444444-4444-4444-4444-444444444442',
  'Caregiving Without Losing Yourself',
  'caregiving-without-losing-yourself',
  'Caregivers hold everyone else together. VelNit Care was built to hold the caregiver too.',
  '## The invisible weight\n\nCaregiving is an act of love that quietly reshapes a life. Appointments, medications, emergencies - it adds up.\n\n## Designing for the caregiver, not just the care recipient\n\nVelNit Care centers daily check-ins and shared dashboards so no one carries the load alone.',
  '/images/blog/caregiving-without-losing-yourself.jpg',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Caregiving Without Losing Yourself | VelNit Life',
  'How VelNit Care supports the whole family, not just the person receiving care.',
  'published',
  now() - interval '3 days'
),
(
  '44444444-4444-4444-4444-444444444443',
  'The TALK Model, Explained',
  'the-talk-model-explained',
  'A simple, repeatable framework couples and families can use to stay emotionally close - Together time, Acknowledgment, Listening, Kindness.',
  '## T - Together time\n\nProtected, undistracted time - even ten minutes - changes everything.\n\n## A - Acknowledgment\n\nBeing seen and named matters more than being fixed.\n\n## L - Listening\n\nListening to understand, not to reply.\n\n## K - Kindness in small moments\n\nThe small gestures compound into a felt sense of safety.',
  '/images/blog/the-talk-model-explained.jpg',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222223',
  'The TALK Model, Explained | VelNit Life',
  'Together time, Acknowledgment, Listening, Kindness - the framework behind VelNit Life.',
  'published',
  now() - interval '1 day'
)
on conflict (id) do nothing;

insert into public.blog_posts_tags (post_id, tag_id) values
  ('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331'),
  ('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333332'),
  ('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333332'),
  ('44444444-4444-4444-4444-444444444443', '33333333-3333-3333-3333-333333333333')
on conflict do nothing;
