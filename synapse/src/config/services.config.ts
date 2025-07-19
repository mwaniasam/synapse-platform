import * as React from 'react';
import { 
  Book as BookIcon, 
  School as SchoolIcon, 
  Code as CodeIcon, 
  Translate as TranslateIcon, 
  Functions as FunctionsIcon, 
  Psychology as PsychologyIcon, 
  Search as SearchIcon, 
  MenuBook as MenuBookIcon, 
  Quiz as QuizIcon,
  SvgIconComponent
} from "@mui/icons-material";

type ServiceCategory = 'learning' | 'tools' | 'ai' | 'reference';

type IconComponent = typeof BookIcon | typeof SchoolIcon | typeof CodeIcon | typeof TranslateIcon | 
                    typeof FunctionsIcon | typeof PsychologyIcon | typeof SearchIcon | 
                    typeof MenuBookIcon | typeof QuizIcon;

export interface ServiceConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
  path: string;
  enabled: boolean;
  category: ServiceCategory;
}

const createService = (
  id: string, 
  name: string, 
  description: string, 
  Icon: IconComponent,
  path: string,
  category: ServiceCategory,
  enabled: boolean = true
): ServiceConfig => ({
  id,
  name,
  description,
  icon: React.createElement(Icon, { key: id }),
  path,
  enabled,
  category
});

export const servicesConfig: ServiceConfig[] = [
  createService(
    'ai-tutor',
    'AI Tutor',
    'Get personalized learning assistance from our AI tutor',
    PsychologyIcon,
    '/ai-tutor',
    'ai'
  ),
  createService(
    'language-translator',
    'Language Translator',
    'Translate text between multiple languages',
    TranslateIcon,
    '/translator',
    'tools'
  ),
  createService(
    'study-planner',
    'Study Planner',
    'Plan and organize your study sessions effectively',
    MenuBookIcon,
    '/study-planner',
    'learning'
  ),
  createService(
    'flashcards',
    'Flashcards',
    'Create and study with digital flashcards',
    BookIcon,
    '/flashcards',
    'learning'
  ),
  createService(
    'quiz-generator',
    'Quiz Generator',
    'Generate quizzes to test your knowledge',
    QuizIcon,
    '/quiz-generator',
    'learning'
  ),
  createService(
    'research-assistant',
    'Research Assistant',
    'Get help with academic research and citations',
    SearchIcon,
    '/research',
    'reference'
  ),
  createService(
    'math-solver',
    'Math Solver',
    'Solve math problems step by step',
    FunctionsIcon,
    '/math-solver',
    'tools'
  ),
  createService(
    'science-lab',
    'Science Lab',
    'Interactive science experiments and simulations',
    SchoolIcon,
    '/science-lab',
    'learning'
  ),
  createService(
    'code-editor',
    'Code Editor',
    'Write, run, and debug code in multiple languages',
    CodeIcon,
    '/code-editor',
    'tools'
  )
];

export const getServiceById = (id: string) => 
  servicesConfig.find(service => service.id === id);

export const getServicesByCategory = (category: string) =>
  servicesConfig.filter(service => service.category === category);

export const getEnabledServices = () =>
  servicesConfig.filter(service => service.enabled);
