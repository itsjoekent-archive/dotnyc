import toml from 'toml';

export default async function loadContent(path) {
  const filePath = `${path}/index.toml`;
  const response = await fetch(`/content${filePath}`);
  const text = await response.text();
  const data = toml.parse(text);

  return data;
}