export default async function loadContent(path) {
  switch (path) {
    case '/work/all-in': {
      return await import('../../content/work/all-in.toml');
    }

    case '/work/arcadia': {
      return await import('../../content/work/arcadia.toml');
    }

    case '/work/data-for-progress': {
      return await import('../../content/work/data-for-progress.toml');
    }

    case '/work/dosomething': {
      return await import('../../content/work/dosomething.toml');
    }

    case '/work/fuller-project': {
      return await import('../../content/work/fuller-project.toml');
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

    case '/work/neighbor-network': {
      return await import('../../content/work/neighbor-network.toml');
    }

    case '/work/vote-from-home': {
      return await import('../../content/work/vote-from-home.toml');
    }

    case '/work/warren-2020': {
      return await import('../../content/work/warren-2020.toml');
    }

    case '/work/when-we-all-vote': {
      return await import('../../content/work/when-we-all-vote.toml');
    }

    default: {
      return null;
    }
  }
}