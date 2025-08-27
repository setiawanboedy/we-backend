import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    const existingFolders = await prisma.folder.findMany();
    if (existingFolders.length > 0) {
      console.log('📁 Data already exists, skipping seed');
      return;
    }

    const documentsFolder = await prisma.folder.create({
      data: {
        name: 'Documents',
        path: '/Documents'
      }
    });

    const picturesFolder = await prisma.folder.create({
      data: {
        name: 'Pictures',
        path: '/Pictures'
      }
    });

    const downloadsFolder = await prisma.folder.create({
      data: {
        name: 'Downloads',
        path: '/Downloads'
      }
    });

    const projectsFolder = await prisma.folder.create({
      data: {
        name: 'Projects',
        path: '/Projects'
      }
    });

    await prisma.folder.createMany({
      data: [
        {
          name: 'Personal',
          path: '/Documents/Personal',
          parentId: documentsFolder.id
        },
        {
          name: 'Work',
          path: '/Documents/Work',
          parentId: documentsFolder.id
        },
        {
          name: 'Archive',
          path: '/Documents/Archive',
          parentId: documentsFolder.id
        }
      ]
    });

    await prisma.folder.createMany({
      data: [
        {
          name: 'Vacation',
          path: '/Pictures/Vacation',
          parentId: picturesFolder.id
        },
        {
          name: 'Family',
          path: '/Pictures/Family',
          parentId: picturesFolder.id
        },
        {
          name: 'Screenshots',
          path: '/Pictures/Screenshots',
          parentId: picturesFolder.id
        }
      ]
    });

    const webDevFolder = await prisma.folder.create({
      data: {
        name: 'Web Development',
        path: '/Projects/Web Development',
        parentId: projectsFolder.id
      }
    });

    const mobileFolder = await prisma.folder.create({
      data: {
        name: 'Mobile Apps',
        path: '/Projects/Mobile Apps',
        parentId: projectsFolder.id
      }
    });

    await prisma.folder.create({
      data: {
        name: 'Data Science',
        path: '/Projects/Data Science',
        parentId: projectsFolder.id
      }
    });

    await prisma.folder.createMany({
      data: [
        {
          name: 'React Projects',
          path: '/Projects/Web Development/React Projects',
          parentId: webDevFolder.id
        },
        {
          name: 'Vue Projects',
          path: '/Projects/Web Development/Vue Projects',
          parentId: webDevFolder.id
        },
        {
          name: 'Node.js APIs',
          path: '/Projects/Web Development/Node.js APIs',
          parentId: webDevFolder.id
        },
        {
          name: 'Flutter',
          path: '/Projects/Mobile Apps/Flutter',
          parentId: mobileFolder.id
        },
        {
          name: 'React Native',
          path: '/Projects/Mobile Apps/React Native',
          parentId: mobileFolder.id
        }
      ]
    });

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedDatabase()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedDatabase };
