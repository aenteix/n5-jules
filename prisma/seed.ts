import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create a user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      xp: 0,
      level: 1,
      currentStreak: 0,
    },
  });
  console.log(`Created user with id: ${user.id}`);

  // Vocabulary data
  const vocabData = [
    { kanji: '猫', kana: 'ねこ', romaji: 'neko', meaning: 'cat' },
    { kanji: '犬', kana: 'いぬ', romaji: 'inu', meaning: 'dog' },
    { kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'I/me' },
    { kanji: '本', kana: 'ほん', romaji: 'hon', meaning: 'book' },
    { kanji: '学生', kana: 'がくせい', romaji: 'gakusei', meaning: 'student' },
    { kanji: '先生', kana: 'せんせい', romaji: 'sensei', meaning: 'teacher' },
    { kanji: '学校', kana: 'がっこう', romaji: 'gakkou', meaning: 'school' },
    { kanji: '食べる', kana: 'たべる', romaji: 'taberu', meaning: 'to eat' },
    { kanji: '飲む', kana: 'のむ', romaji: 'nomu', meaning: 'to drink' },
    { kanji: '行く', kana: 'いく', romaji: 'iku', meaning: 'to go' },
  ];

  // Clearing tables
  await prisma.studyProgress.deleteMany();
  await prisma.vocabulary.deleteMany();
  console.log('Cleared Vocabulary and StudyProgress tables');

  for (const v of vocabData) {
    const vocab = await prisma.vocabulary.create({
      data: v,
    });
    console.log(`Created vocab with id: ${vocab.id} - ${vocab.kanji}`);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
