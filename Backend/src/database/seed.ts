import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Progress } from '../progress/entities/progress.entity';
import { QuestionDifficulty } from '../questions/enums/question-difficulty.enum';
import { Question } from '../questions/entities/question.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { Topic } from '../topics/entities/topic.entity';
import { getDataSourceOptions } from './typeorm.config';

config();

type SeedQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  year?: number;
  difficulty: QuestionDifficulty;
};

type SeedTopic = {
  key: string;
  name: string;
  questions: SeedQuestion[];
};

type SeedSubject = {
  key: string;
  name: string;
  form: number;
  topics: SeedTopic[];
};

const seedData: SeedSubject[] = [
  {
    key: 'math-form-2',
    name: 'Mathematics',
    form: 2,
    topics: [
      {
        key: 'fractions',
        name: 'Fractions',
        questions: [
          {
            question: 'What is 3/4 + 1/8?',
            options: ['7/8', '1', '5/8', '3/8'],
            answer: '7/8',
            explanation: 'Convert 3/4 to 6/8, then add 1/8 to get 7/8.',
            difficulty: QuestionDifficulty.EASY,
          },
          {
            question: 'Simplify 18/24.',
            options: ['3/4', '6/8', '9/12', '2/3'],
            answer: '3/4',
            explanation: 'Divide numerator and denominator by 6.',
            difficulty: QuestionDifficulty.EASY,
          },
          {
            question: 'What is 5/6 - 1/4?',
            options: ['7/12', '2/12', '1/2', '3/8'],
            answer: '7/12',
            explanation: 'Use a common denominator of 12: 10/12 - 3/12 = 7/12.',
            difficulty: QuestionDifficulty.MEDIUM,
          },
        ],
      },
      {
        key: 'linear-equations',
        name: 'Linear Equations',
        questions: [
          {
            question: 'Solve for x: 2x + 5 = 17.',
            options: ['5', '6', '7', '8'],
            answer: '6',
            explanation: 'Subtract 5 from both sides to get 2x = 12, then divide by 2.',
            difficulty: QuestionDifficulty.EASY,
          },
          {
            question: 'Solve for y: 3y - 4 = 11.',
            options: ['3', '4', '5', '6'],
            answer: '5',
            explanation: 'Add 4 to both sides to get 3y = 15, then divide by 3.',
            difficulty: QuestionDifficulty.EASY,
          },
          {
            question: 'Solve for x: 4x + 7 = 3x + 15.',
            options: ['6', '7', '8', '9'],
            answer: '8',
            explanation: 'Subtract 3x from both sides to get x + 7 = 15, then subtract 7.',
            year: 2022,
            difficulty: QuestionDifficulty.MEDIUM,
          },
        ],
      },
    ],
  },
  {
    key: 'agriculture-form-2',
    name: 'Agriculture',
    form: 2,
    topics: [
      {
        key: 'soil',
        name: 'Soil Composition',
        questions: [
          {
            question: 'Which soil type has the highest water-holding capacity?',
            options: ['Clay', 'Sand', 'Loam', 'Silt'],
            answer: 'Clay',
            explanation: 'Clay particles are very small and hold water for longer.',
            difficulty: QuestionDifficulty.EASY,
          },
          {
            question: 'What is the main role of humus in soil?',
            options: [
              'Adds organic matter and nutrients',
              'Removes air spaces',
              'Increases erosion',
              'Prevents root growth',
            ],
            answer: 'Adds organic matter and nutrients',
            explanation: 'Humus improves fertility, structure, and moisture retention.',
            difficulty: QuestionDifficulty.MEDIUM,
          },
          {
            question: 'Which practice helps reduce soil erosion on a slope?',
            options: ['Contour ridging', 'Overgrazing', 'Burning residues', 'Deforestation'],
            answer: 'Contour ridging',
            explanation: 'Contour ridging slows water runoff and preserves topsoil.',
            difficulty: QuestionDifficulty.MEDIUM,
          },
        ],
      },
      {
        key: 'crop-production',
        name: 'Crop Production',
        questions: [
          {
            question: 'What is the main reason farmers rotate crops?',
            options: [
              'To maintain soil fertility',
              'To increase weeds',
              'To use more fertilizer',
              'To shorten growing seasons',
            ],
            answer: 'To maintain soil fertility',
            explanation: 'Crop rotation helps manage nutrients and reduce pests and disease.',
            difficulty: QuestionDifficulty.EASY,
          },
          {
            question: 'Which factor is most important when selecting maize seed?',
            options: [
              'Adaptation to local conditions',
              'Largest grain size only',
              'Brightest packaging',
              'Lowest transport cost',
            ],
            answer: 'Adaptation to local conditions',
            explanation: 'Seed suited to the environment usually gives more reliable yields.',
            year: 2021,
            difficulty: QuestionDifficulty.MEDIUM,
          },
          {
            question: 'What is top dressing in crop management?',
            options: [
              'Applying fertilizer after the crop has emerged',
              'Ploughing before rainfall',
              'Harvesting early',
              'Removing damaged leaves',
            ],
            answer: 'Applying fertilizer after the crop has emerged',
            explanation: 'Top dressing adds nutrients, especially nitrogen, during growth.',
            difficulty: QuestionDifficulty.HARD,
          },
        ],
      },
    ],
  },
  {
    key: 'biology-form-4',
    name: 'Biology',
    form: 4,
    topics: [
      {
        key: 'cell-biology',
        name: 'Cell Biology',
        questions: [
          {
            question: 'Which organelle controls activities inside the cell?',
            options: ['Nucleus', 'Vacuole', 'Cell wall', 'Ribosome'],
            answer: 'Nucleus',
            explanation: 'The nucleus contains genetic material and controls cell activities.',
            difficulty: QuestionDifficulty.EASY,
          },
          {
            question: 'Which structure is present in plant cells but absent in animal cells?',
            options: ['Cell wall', 'Cell membrane', 'Cytoplasm', 'Mitochondrion'],
            answer: 'Cell wall',
            explanation: 'Plant cells have a rigid cell wall for support and protection.',
            difficulty: QuestionDifficulty.EASY,
          },
          {
            question: 'What is the function of mitochondria?',
            options: [
              'Release energy through respiration',
              'Store water permanently',
              'Control cell division only',
              'Produce chlorophyll',
            ],
            answer: 'Release energy through respiration',
            explanation: 'Mitochondria are the site of aerobic respiration in eukaryotic cells.',
            difficulty: QuestionDifficulty.MEDIUM,
          },
        ],
      },
      {
        key: 'genetics',
        name: 'Genetics',
        questions: [
          {
            question: 'What does DNA stand for?',
            options: [
              'Deoxyribonucleic acid',
              'Double nitrogen acid',
              'Deoxygenated nucleic acid',
              'Dynamic ribonuclear acid',
            ],
            answer: 'Deoxyribonucleic acid',
            explanation: 'DNA is the hereditary material found in chromosomes.',
            difficulty: QuestionDifficulty.EASY,
          },
          {
            question: 'A dominant allele is one that:',
            options: [
              'Expresses itself in the phenotype when present',
              'Disappears in offspring',
              'Only appears in females',
              'Cannot be inherited',
            ],
            answer: 'Expresses itself in the phenotype when present',
            explanation: 'A dominant allele shows its effect even if only one copy is present.',
            year: 2020,
            difficulty: QuestionDifficulty.MEDIUM,
          },
          {
            question: 'What is the genotype of a heterozygous individual?',
            options: ['Two different alleles', 'Two recessive alleles', 'Two dominant alleles', 'No alleles'],
            answer: 'Two different alleles',
            explanation: 'Heterozygous means the paired alleles are not the same.',
            difficulty: QuestionDifficulty.MEDIUM,
          },
        ],
      },
    ],
  },
  {
    key: 'english-form-4',
    name: 'English Language',
    form: 4,
    topics: [
      {
        key: 'comprehension',
        name: 'Reading Comprehension',
        questions: [
          {
            question: 'Which reading skill is best for finding a specific date in a passage?',
            options: ['Scanning', 'Skimming', 'Predicting', 'Summarising'],
            answer: 'Scanning',
            explanation: 'Scanning is used to locate a specific fact or detail quickly.',
            difficulty: QuestionDifficulty.EASY,
          },
          {
            question: 'Skimming a passage helps a student to:',
            options: [
              'Get the general idea quickly',
              'Memorise every sentence',
              'Translate every word',
              'Identify all punctuation marks',
            ],
            answer: 'Get the general idea quickly',
            explanation: 'Skimming focuses on the main point rather than every detail.',
            difficulty: QuestionDifficulty.EASY,
          },
          {
            question: 'An inference question asks a reader to:',
            options: [
              'Work out meaning from clues in the text',
              'Count paragraphs only',
              'Rewrite the whole passage',
              'List all the nouns',
            ],
            answer: 'Work out meaning from clues in the text',
            explanation: 'Inference relies on hints and evidence that are not stated directly.',
            difficulty: QuestionDifficulty.MEDIUM,
          },
        ],
      },
      {
        key: 'grammar',
        name: 'Grammar',
        questions: [
          {
            question: 'Choose the correct sentence.',
            options: [
              'She does not like noise.',
              'She do not like noise.',
              'She does not likes noise.',
              'She not does like noise.',
            ],
            answer: 'She does not like noise.',
            explanation: 'The auxiliary verb "does" takes the base form of the main verb.',
            difficulty: QuestionDifficulty.EASY,
          },
          {
            question: 'What is the past tense of "teach"?',
            options: ['Taught', 'Teached', 'Teaching', 'Teachen'],
            answer: 'Taught',
            explanation: 'Teach is an irregular verb with the past tense taught.',
            difficulty: QuestionDifficulty.EASY,
          },
          {
            question: 'Identify the adjective in the sentence: "The careful student checked every answer."',
            options: ['Careful', 'Student', 'Checked', 'Answer'],
            answer: 'Careful',
            explanation: 'Careful describes the noun student, so it is the adjective.',
            year: 2023,
            difficulty: QuestionDifficulty.MEDIUM,
          },
        ],
      },
    ],
  },
];

async function runSeed(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Add it to your .env file first.');
  }

  const dataSource = new DataSource(getDataSourceOptions());

  try {
    await dataSource.initialize();

    if (process.env.NODE_ENV !== 'production') {
      await dataSource.synchronize();
    }

    await dataSource.query(
      'TRUNCATE TABLE "progress", "question", "topic", "subject" RESTART IDENTITY CASCADE;',
    );

    const subjectRepository = dataSource.getRepository(Subject);
    const topicRepository = dataSource.getRepository(Topic);
    const questionRepository = dataSource.getRepository(Question);

    const savedSubjects = await subjectRepository.save(
      seedData.map((subject) =>
        subjectRepository.create({
          name: subject.name,
          form: subject.form,
        }),
      ),
    );

    const subjectMap = new Map<string, Subject>();
    seedData.forEach((subject, index) => {
      subjectMap.set(subject.key, savedSubjects[index]);
    });

    const topicSeedRows = seedData.flatMap((subject) =>
      subject.topics.map((topic) => ({
        subjectKey: subject.key,
        key: topic.key,
        name: topic.name,
      })),
    );

    const savedTopics = await topicRepository.save(
      topicSeedRows.map((topic) =>
        topicRepository.create({
          name: topic.name,
          subjectId: subjectMap.get(topic.subjectKey)!.id,
        }),
      ),
    );

    const topicMap = new Map<string, Topic>();
    topicSeedRows.forEach((topic, index) => {
      topicMap.set(topic.key, savedTopics[index]);
    });

    const questionSeedRows = seedData.flatMap((subject) =>
      subject.topics.flatMap((topic) =>
        topic.questions.map((question) => ({
          topicKey: topic.key,
          ...question,
        })),
      ),
    );

    await questionRepository.save(
      questionSeedRows.map((question) =>
        questionRepository.create({
          topicId: topicMap.get(question.topicKey)!.id,
          question: question.question,
          options: question.options,
          answer: question.answer,
          explanation: question.explanation,
          year: question.year,
          difficulty: question.difficulty,
        }),
      ),
    );

    const subjectCount = await subjectRepository.count();
    const topicCount = await topicRepository.count();
    const questionCount = await questionRepository.count();

    console.log(
      `Seed complete: ${subjectCount} subjects, ${topicCount} topics, ${questionCount} questions.`,
    );
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

runSeed().catch((error: unknown) => {
  console.error('Seeding failed.', error);
  process.exit(1);
});
