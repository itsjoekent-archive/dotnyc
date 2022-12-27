const fs = require('fs').promises;
const path = require('path');

const toml = require('toml');

function removeTrailingSlash(input) {
  if (input.length === 1) return input;
  return input.replace(/\/+$/, '');
}

async function getTomlFiles(directory) {
  const files = await fs.readdir(directory);
  let tomlFiles = files
    .filter((file) => file.endsWith('.toml'))
    .map((file) => path.join(directory, file));

  for (const file of files) {
    if (!file.includes('.')) {
      const subFiles = await getTomlFiles(path.join(directory, file));
      tomlFiles = [...tomlFiles, ...subFiles];
    }
  }

  return tomlFiles;
}

(async function () {
  const indexHtml = await fs.readFile(
    path.join(process.cwd(), './dist/index.html'),
    'utf8'
  );
  const pageContentFiles = await getTomlFiles(
    path.join(process.cwd(), './content')
  );

  for (const pageContentFilePath of pageContentFiles) {
    const pageToml = await fs.readFile(pageContentFilePath, 'utf8');
    const pageData = toml.parse(pageToml);

    if (!pageData.template) continue;

    const realPath = removeTrailingSlash(
      pageContentFilePath
        .replace(path.join(process.cwd(), '/content'), '')
        .replace('/index', '/')
        .replace('.toml', '')
    );

    console.log(`Building ${realPath}`);

    const realHtml = indexHtml
      .replace(
        `window.PAGE_DATA={};`,
        `window.PAGE_DATA=${JSON.stringify(pageData)};`
      )
      .replace(
        '<title>placeholder</title>',
        `<title>${
          pageData.title ? `${pageData.title} | Joe Kent` : 'Joe Kent'
        }</title>`
      );

    const distDirectory = path.join(process.cwd(), '/dist', realPath);

    if (realPath.split('/').length > 1) {
      await fs.mkdir(distDirectory, { recursive: true });
    }

    await fs.writeFile(path.join(distDirectory, 'index.html'), realHtml);
  }
})();
