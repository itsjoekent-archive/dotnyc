export default async function loadContent(path) {
  switch (path) {
    case '/':
    case '/index': {
      return await import('../../content/index.toml');
    }

    case '/work/data-for-progress': {
      return await import('../../content/work/data-for-progress.toml');
    }

    case '/work/georgia-2020': {
      return await import('../../content/work/georgia-2020.toml');
    }

    case '/work/invest-in-america': {
      return await import('../../content/work/invest-in-america.toml');
    }

    case '/work/leftfield': {
      return await import('../../content/work/leftfield.toml');
    }

    case '/work/markey-2020': {
      return await import('../../content/work/markey-2020.toml');
    }

    case '/work/warren-2020': {
      return await import('../../content/work/warren-2020.toml');
    }

    default: {
      return null;
    }
  }
}