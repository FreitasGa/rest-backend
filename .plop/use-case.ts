import type { NodePlopAPI } from 'plop';
import { Queue } from '../src/services/queue';

const handlers = {
  http: 'http',
  queue: 'queue',
  schedule: 'schedule',
};

const queues = Object.values(Queue);

export default function (plop: NodePlopAPI) {
  plop.setGenerator('Use Case', {
    description: 'Use Case',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your use case name?',
      },
      {
        type: 'list',
        name: 'handler',
        message: 'Which handler do you want to use?',
        choices: Object.values(handlers),
        default: 'http',
      },
      {
        type: 'list',
        name: 'http.method',
        message: 'Which method do you want to use?',
        choices: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        when: (answers) => answers.handler === handlers.http,
      },
      {
        type: 'input',
        name: 'http.path',
        message: 'What is your path?',
        when: (answers) => answers.handler === handlers.http,
      },
      {
        type: 'list',
        name: 'queue.name',
        message: 'Which queue do you want to use?',
        choices: queues,
        when: (answers) => answers.handler === handlers.queue,
      },
      {
        type: 'input',
        name: 'queue.job',
        message: 'What is your job name? (default: undefined)',
        default: undefined,
        when: (answers) => answers.handler === handlers.queue,
      },
      {
        type: 'input',
        name: 'schedule.cron',
        message: 'What is your cron expression? (default: 0 0 * * *)',
        default: '0 0 * * *',
        when: (answers) => answers.handler === handlers.schedule,
      },
      {
        type: 'confirm',
        name: 'test.unit',
        message: 'Do you want to create a unit test? (default: true)',
        default: true,
      },
    ],
    actions: (answers) => {
      const actions = [
        {
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/use-case.ts',
          templateFile: 'templates/use-case.ts.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/dtos.ts',
          templateFile: 'templates/dtos.ts.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/errors.ts',
          templateFile: 'templates/errors.ts.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/factory.ts',
          templateFile: 'templates/factory.ts.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/repository.ts',
          templateFile: 'templates/repository.ts.hbs',
          skipIfExists: true,
        },
      ];

      if (answers?.handler === handlers.http) {
        actions.push({
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/controller.ts',
          templateFile: 'templates/controller.ts.hbs',
          skipIfExists: true,
        });
      }

      if (answers?.handler === handlers.queue) {
        actions.push({
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/worker.ts',
          templateFile: 'templates/worker.ts.hbs',
          skipIfExists: true,
        });
      }

      if (answers?.handler === handlers.schedule) {
        actions.push({
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/scheduler.ts',
          templateFile: 'templates/scheduler.ts.hbs',
          skipIfExists: true,
        });
      }

      if (answers?.test.unit === true) {
        actions.push({
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/spec/use-case.spec.ts',
          templateFile: 'templates/spec/use-case.spec.ts.hbs',
          skipIfExists: true,
        });

        actions.push({
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/spec/fixtures/dtos.ts',
          templateFile: 'templates/spec/fixtures/dtos.ts.hbs',
          skipIfExists: true,
        });

        actions.push({
          type: 'add',
          path: '../src/use-cases/{{kebabCase name}}/spec/fixtures/repository.ts',
          templateFile: 'templates/spec/fixtures/repository.ts.hbs',
          skipIfExists: true,
        });
      }

      return actions;
    },
  });
}
