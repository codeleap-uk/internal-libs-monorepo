import os
import re

def extract_variables(article_variables: list):
  separator = '---'
  frontmatter = ''

  for idx, variable in enumerate(article_variables):
    isFirst = idx == 0
    isLast = idx == (len(article_variables) - 1)

    if isFirst:
      frontmatter = frontmatter + f'{separator}'
    
    frontmatter = frontmatter + f"\n{variable['name']}: '{variable['value']}'"

    if isLast:
      frontmatter = frontmatter + f'\n{separator}'

  return frontmatter

def insert_frontmatter(file: str):
  article_content = None

  with open(file, 'r') as article:
    article_content = article.read()

  description_pattern = r"## Description([\s\S]*?)(?=\n#+\s|\Z)"
  description_matches = re.search(description_pattern, article_content)

  description_content = ''

  if description_matches:
    description_content = description_matches.group(1)

  title = os.path.splitext(os.path.basename(file))[0]
  tag = 'component'
  description = re.sub(r'\n-+\n', ' ', description_content)
  source = f'https://github.com/codeleap-uk/internal-libs-monorepo/blob/master/packages/web/src/components/{title}/index.tsx'

  frontmatter = extract_variables([
    { 'name': 'title', 'value': title },
    { 'name': 'description', 'value': description },
    { 'name': 'tag', 'value': tag },
    { 'name': 'source', 'value': source },
    { 'name': 'verified', 'value': 'false'  },
    { 'name': 'author', 'value': 'Docs Generator' },
    { 'name': 'reviewer', 'value': '' }
  ])

  article_content = re.sub(description_pattern, '\n', article_content)

  new_article_content = frontmatter + '\n\n' + article_content

  with open(file, 'w') as article:
    article.write(new_article_content)

  return
