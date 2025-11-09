import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with demo data...');

  await prisma.vote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.subreddit.deleteMany();
  await prisma.user.deleteMany();

  const [alice, bob, carol] = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        image: 'https://i.pravatar.cc/160?img=1',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Martinez',
        email: 'bob@example.com',
        image: 'https://i.pravatar.cc/160?img=15',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carol Lee',
        email: 'carol@example.com',
        image: 'https://i.pravatar.cc/160?img=32',
      },
    }),
  ]);

  const design = await prisma.subreddit.create({
    data: {
      name: 'designcraft',
      title: 'Design Craft',
      description: 'UI/UX, motion, и визуальный дизайн в цифровых продуктах.',
      bannerUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
    },
  });

  const webdev = await prisma.subreddit.create({
    data: {
      name: 'nextwave',
      title: 'Next.js Wave',
      description: 'Новости, практики и вдохновение для Next.js разработчиков.',
      bannerUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1600&q=80',
    },
  });

  const productivity = await prisma.subreddit.create({
    data: {
      name: 'focusflow',
      title: 'Focus Flow',
      description: 'Приёмы продуктивности, любимые инструменты и рабочие ритуалы.',
      bannerUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
    },
  });

  await prisma.post.create({
    data: {
      title: 'Гайд по мягким градиентам для современного UI',
      content:
        'Собрал подборку техник и инструментов, которые помогают быстро делать атмосферные градиенты без визуального шума.',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
      subredditId: design.id,
      authorId: alice.id,
      votes: {
        create: [
          { value: 1, userId: alice.id },
          { value: 1, userId: bob.id },
          { value: 1, userId: carol.id },
        ],
      },
      comments: {
        create: [
          {
            content: 'Выглядит вдохновляюще, спасибо за ресурсы! 🔥',
            authorId: bob.id,
            replies: {
              create: [
                {
                  content: 'Спасибо! Буду рад, если поделишься своими любимыми примерами.',
                  authorId: alice.id,
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: 'Обновлённый шаблон аналитики для Next.js 14',
      content:
        'Мы перевели dashboard на App Router, добавили edge-функции и гибридный рендеринг. Внутри репо — готовые виджеты и примеры запросов.',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
      subredditId: webdev.id,
      authorId: carol.id,
      votes: {
        create: [
          { value: 1, userId: carol.id },
          { value: 1, userId: alice.id },
          { value: -1, userId: bob.id },
        ],
      },
      comments: {
        create: [
          {
            content: 'Очень кстати, как раз искал примеры метрик на server actions.',
            authorId: alice.id,
          },
          {
            content: 'Понравилось, как вы вынесли клиентский state в отдельные хуки.',
            authorId: bob.id,
          },
        ],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: 'Три ритуала, которые держат меня в фокусе',
      content:
        'Коротко про утренние страницы, тематические таймбоксы и вечерний демо-дневник. Работает уже 6 месяцев без провалов.',
      imageUrl: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1600&q=80',
      subredditId: productivity.id,
      authorId: bob.id,
      votes: {
        create: [
          { value: 1, userId: bob.id },
          { value: 1, userId: alice.id },
        ],
      },
      comments: {
        create: [
          {
            content: 'Бергу и сам попробую вечерний демо-дневник, звучит полезно.',
            authorId: carol.id,
          },
          {
            content: 'Утренние страницы — топ, мне ещё помогает ранний заряд бодрящей музыкой.',
            authorId: alice.id,
          },
        ],
      },
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
