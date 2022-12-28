import fs from 'fs/promises';
import path from 'path';
import express from 'express';
import he from 'he';
import mustache from 'mustache';
import MarkdownIt from 'markdown-it';
import toml from 'toml';
import * as Content from './content';

dotenv.config();

type MustacheLambdaFunction = (input: string) => string;

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
});

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

  function mediaLambda() {
    function _mediaLambda(mediaFile: string, render: MustacheLambdaFunction) {
      return `${process.env.DOTNYC_BUCKET_PUBLIC_URL}/${render(mediaFile)}`;
    }

    return _mediaLambda;
  }

  function markdownLambda() {
    function _markdownLambda(markup: string, render: MustacheLambdaFunction) {
      // TOML has dumb character escape rules. 
      // And mustache doesn't run lambda's on replace variable values.
      // This escapes the HTML entities from the TOML multi-line string,
      // and also fixes mustache running Lambdas against nested variable values.
      return markdown.render(render(he.decode(render(he.decode(markup)))), {
        html: true,
        linkify: true,
      });
    }

    return _markdownLambda;
  }

  const templateFunctions = {
    markdown: markdownLambda,
    media: mediaLambda,
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

(async () => {
  if (process.env.NODE_ENV === 'development') {
    const app = express();

    app.use('/dist', express.static('www/dist'));
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
    console.log('generating pages...');

    const allContent = await readAllContent();

    for (const content of allContent) {
      const templateHtml = await renderTemplate(content);
      const html = await renderTemplate({
        ...content,
        template: 'index',
        templateHtml,
      });

      const indexFolderPath = path.join(process.cwd(), 'www', content.path);
      await fs.mkdir(indexFolderPath, { recursive: true });
      await fs.writeFile(path.join(indexFolderPath, 'index.html'), html);
    }
    
    console.log('downloading media...');

    const params = {
      Bucket: 'dotnyc',
    };

    const { Contents: objects } = await s3.listObjects(params).promise();
    if (!objects) return;

    const mediaFolderPath = path.join(process.cwd(), 'www/dist/media');
    await fs.mkdir(mediaFolderPath, { recursive: true });

    await Promise.all(objects.map(({ Key: key }) => {
      if (!key) return null;

      const remotePath = `${process.env.DOTNYC_BUCKET_PUBLIC_URL}/${key}`;
      return download(remotePath, mediaFolderPath);
    }));
  }
})();
