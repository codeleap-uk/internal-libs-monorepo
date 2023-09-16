import os
import re

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

  frontmatter = f'''---
title: '{title}'
description: '{description}'
tag: '{tag}'
source: '{source}'
---'''

  article_content = re.sub(description_pattern, '\n', article_content)

  new_article_content = frontmatter + '\n\n' + article_content

  with open(file, 'w') as article:
    article.write(new_article_content)

  return
