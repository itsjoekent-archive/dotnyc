import fs from 'fs/promises';
import path from 'path';
import express from 'express';
import mustache from 'mustache';
import showdown from 'showdown';
import toml from 'toml';
import * as Content from './content';

type MustacheRenderFunction = (input: string) => string;

const markdownConverter = new showdown.Converter();

async function readAllContent(): Promise<Content.ContentBase[]> {
  const contentDirectory = path.join(process.cwd(), 'content');
  const contentFileNames = await fs.readdir(contentDirectory);

  const allContent: Content.ContentBase[] = [];

  for (const contentFileName of contentFileNames) {
    const contentFileBuffer = await fs.readFile(
      path.join(contentDirectory, contentFileName)
    );
    const parsedContent = toml.parse(contentFileBuffer.toString('utf8'));

    if (
      !Content.getEnumKeys(Content.ContentBaseRequiredKeys).every(
        (key) => !!parsedContent[key]
      )
    ) {
      throw new Error(
        `${contentFileName} is missing a one of the required keys (${Object.keys(
          Content.ContentBaseRequiredKeys
        ).join(', ')})`
      );
    }

    allContent.push(parsedContent as Content.ContentBase);
  }

  return allContent;
}

async function renderTemplate(
  content: Content.ContentWithTemplate | Content.ContentForIndex
): Promise<string> {
  const templateBuffer = await fs.readFile(
    path.join(process.cwd(), 'templates', `${content.template}.html`)
  );
  const template = templateBuffer.toString('utf8');

  const templateFunctions = {
    markdown: function media() {
      return function _media(markup: string, render: MustacheRenderFunction) {
        return markdownConverter.makeHtml(render(markup));
      };
    },
    media: function media() {
      return function _media(
        mediaFile: string,
        render: MustacheRenderFunction
      ) {
        return process.env.NODE_ENV === 'development'
          ? `https://itsjoekent.s3.amazonaws.com/${render(mediaFile)}`
          : `/dist/${render(mediaFile)}`;
      };
    },
  };

  const templateData =
    typeof content.templateData === 'string' ? {} : content.templateData;
  const renderedTemplate = mustache.render(template, {
    ...content,
    ...templateData,
    ...templateFunctions,
  });

  return renderedTemplate;
}

function trimLastSlash(path: string) {
  return path === '/'
    ? path
    : path.endsWith('/')
    ? path.substring(0, path.length - 1)
    : path;
}

(() => {
  if (process.env.NODE_ENV === 'development') {
    const app = express();

    app.use('/dist', express.static('dist'));
    app.get('/*', async (request, response) => {
      try {
        const content = await readAllContent();
        const match: Content.ContentBase | undefined = content.find(
          (compare) => compare.path === trimLastSlash(request.path)
        );

        if (!match) {
          return response.status(404).send('not found');
        }

        const templateHtml = await renderTemplate(match);
        const html = await renderTemplate({
          ...match,
          template: 'index',
          templateHtml,
        });

        response.set('content-type', 'text/html').send(html);
      } catch (error) {
        console.error(error);
        response.status(500).send('server error');
      }
    });

    app.listen(5000, () => console.log(`Listening on port 5000`));
  } else {
    // readAllContent
    // renderPage => fs.writeFile('dist...')
  }
})();
