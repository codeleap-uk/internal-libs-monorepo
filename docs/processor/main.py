from insert_frontmatter import insert_frontmatter
from config import get_config
import os

def main():
  print('Processor (log) -> Starting...')

  config = get_config()
  articles_output = config['articlesOutputDir']

  files = os.listdir(articles_output)

  articles = [file for file in files if os.path.isfile(os.path.join(articles_output, file))]

  for article in articles:
    print(f'processing {article}')

    insert_frontmatter(f'{articles_output}/{article}')

main()
